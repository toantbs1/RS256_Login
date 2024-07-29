const jwt = require('jsonwebtoken')
const fs = require('fs')

const publicKey = fs.readFileSync('./public_key.pem', 'utf-8')

const authMiddleware = (req, res, next) => {
    const token = req.headers.cookie.split('=')[1]
    jwt.verify(token, publicKey, (err, user) => {
        if(err) {
            return res.status(404).json({
                status: "error",
                message: "the authemation"
            })
        }
        if(user?.isAdmin)
            next()
        else {
            return res.status(404).json({
                status: "error",
                message: "Không phải là admin"
            })
        }
    })
}

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.cookie.split('=')[1]
    const userId = req.params.id
    jwt.verify(token, publicKey, (err, user) => {
        if(err) {
            return res.status(404).json({
                status: "error",
                message: "the authemation"
            })
        }
        if(user?.isAdmin || user?.id === userId) {
            next()
        }
        else{ 
            return res.status(404).json({
                status: "error",
                message: "Không đủ quyền"
            })
        }
    })
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}

