const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const { egcd, getRandom, modulus, chooseE} = require("./RSA")
const {sha256, sha256_10, base64UrlEncode, JWTDecode} = require('./sha256_base64')

//Tạo số nguyên tố p và q ngẫu nhiên
const p = getRandom()
const q = getRandom()
console.log('Số nguyên tố p:', p)
console.log('Số nguyên tố q:', q)

//Tính n và phiN
const n = p*q
console.log('n:', n)

const phiN = (p-BigInt(1))*(q-BigInt(1))
console.log("phiN:",phiN)

//Public key
const e = chooseE(phiN)
console.log('Public Key: e:', e, ', n:', n)

//Private key
const d = egcd(e, phiN)
console.log('Private Key: d:', d, ', n:', n)

const Header = {
    alg:'RS256',
    typ:'JWT'
}

const genneralAccessToken = async (payload) => {
    // Tạo mã iat và exp
    let iat = Math.floor(Date.now() / 1000);
    let expAT = iat + 30; // Hết hạn sau 30s
    let accessHead = base64UrlEncode(JSON.stringify(Header))
    let accessPay = base64UrlEncode(JSON.stringify({
        ...payload,
        iat: iat,
        exp: expAT,
    }))
    let signatureAccessToken = modulus(sha256_10(`${accessHead}.${accessPay}`), d, n)
    if(modulus(signatureAccessToken, e, n) === sha256_10(`${accessHead}.${accessPay}`)) {
        return `${accessHead}.${accessPay}.${sha256(`${accessHead}.${accessPay}`)}`
    }
    else {
        return null
    }
}

const genneralRefreshToken = async (payload) => {
    // Tạo mã iat và exp
    let iat = Math.floor(Date.now() / 1000);
    let expRT = iat + 86400; //Hết hạn sau 1d
    let refreshHead = base64UrlEncode(JSON.stringify(Header))
    let refreshPay = base64UrlEncode(JSON.stringify({
        ...payload,
        iat: iat,
        exp: expRT,
    }))
    let signatureRefreshToken = modulus(sha256_10(`${refreshHead}.${refreshPay}`), d, n)
    if(modulus(signatureRefreshToken, e, n) === sha256_10(`${refreshHead}.${refreshPay}`)) {
        return `${refreshHead}.${refreshPay}.${sha256(`${refreshHead}.${refreshPay}`)}`
    }
    else {
        return null
    }
}

const refreshTokenJwtService = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let tokenHeader = token.split('.')[0]
            let tokenPayload = token.split('.')[1]
            let tokenTestHeader =  JSON.parse(JWTDecode(tokenHeader))
            let tokenTestPayload =  JSON.parse(JWTDecode(tokenPayload))
            let signature = modulus(sha256_10(`${tokenHeader}.${tokenPayload}`), d, n)
            if(tokenTestHeader.alg === Header.alg && modulus(signature, e, n) === sha256_10(`${tokenHeader}.${tokenPayload}`) && Math.floor(Date.now() / 1000) < tokenTestPayload.exp) {
                let access_token = await genneralAccessToken({
                    id: tokenTestPayload?.id,
                    isAdmin: tokenTestPayload?.isAdmin
                })
                resolve({
                    status: 'OK',
                    message: 'get success',
                    access_token
                })
            } else {
                resolve({
                    status: 'ERR',
                    message: 'The authematication token is invalid'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}