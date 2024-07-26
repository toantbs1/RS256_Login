const User = require('../models/UserModel')
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser != null) {
                resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại',
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'Tạo tài khoản thành công',
                    data: createdUser
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (UserLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = UserLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser == null) {
                resolve({
                    status: 'ERR',
                    message: 'User không tồn tại',
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'Đăng nhập không thành công',
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                status: 'OK',
                message: 'Đăng nhập thành công',
                access_token,
                refresh_token,

            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) =>{
    return new Promise(async (resolve, reject)=>{
        try{
            const checkUser = User.findOne({
                _id: id
            })
            if(checkUser === null){
                resolve({
                    status: "Error",
                    message: "Tai khoan khong ton tai",
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, {new: true})
            resolve({
                status: "OK",
                message: "Cap nhat thanh cong",
                data: updatedUser
            })
        }
        catch(e){
            reject(e)
        }
    })
}

const deleteUser = (id) =>{
    return new Promise(async (resolve, reject) =>{
        try{
            const checkUser = User.findOne({
                _id: id
            })
            if(!checkUser){
                resolve({
                    status: "Error",
                    message:"User khong ton tai"
                })
            }
            response = await User.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message:"Xoa thanh cong"
            })
        } catch(e){
            reject(e)
        }
    })
}

const getAllUser = (data) =>{
    return new Promise(async (resolve, reject)=>{
        try{
            response = await User.getAllUser()
            resolve({
                status: "OK",
                message:"Thanh cong"
            })
        } catch(e){
            reject(e)
        }
    })
}

const getUser = (id)=>{
    return new Promise(async (resolve, reject)=>{
        const checkUser = User.findOne({
            _id: id
        })
        if(!checkUser){
            resolve({
                status: "Error",
                message:"USER KHONG TON TAI"
            })
        }
        resolve({
            status:"OK",
            message: "Thanh cong",
            data: checkUser
        })
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getUser
}