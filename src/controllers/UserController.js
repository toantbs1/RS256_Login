const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Thong tin con thieu'
            })
        } else if (!isCheckEmail) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Email da ton tai'
            })
        } else if (password !== confirmPassword) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Mat khau khong hop le'
            })
        }

        response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({
            message: err
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The email is required'
            })
        }

        response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict',
            path: '/',
        })
        return res.status(200).json(newResponse)
    } catch (err) {
        return res.status(404).json({
            message: err
        })
    }
}

const updateUser = async (req, res) =>{
    try{
        const userId = req.params.id
        const data = req.body
        if(userId === null){
            return res.status(404).json({
                status:"Error",
                message:"User khong ton tai"
            })
        }
        response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res)=>{
    try{
        const userId = req.params.id
        if(!userId){
            return res.status(404).json({
                status:"Error",
                message: "User khong ton tai"
            })
        }
        response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    }
    catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const getAllUser = async(req, res)=>{
    try{
        response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

// const getUser = async(req, res) =>{
//     try{
//         const userId = User.findOne({
//             _id: id
//         })
//         if(!userId){
//             return res.status(404).json({
//                 status: "Error",
//                 message: "User khong ton tai"
//             })
//         }
//     }
// }

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token
        if (!token) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The token is not required'
            })
        }
        response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({
            message: err
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (err) {
        return res.status(404).json({
            message: err
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    refreshToken,
    logoutUser,
}