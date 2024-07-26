const express = require('express');
const router = express.Router()
const UserController = require('../controllers/UserController')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleWare')

router.post('/sign-up', UserController.createUser)
router.post('/sign-in', UserController.loginUser)
router.put('/update/:id', authUserMiddleware, UserController.updateUser)
router.delete('/delete/:id', authUserMiddleware, UserController.deleteUser)
router.post('/log-out', UserController.logoutUser)
router.get('/getUser/:id', authUserMiddleware, UserController.getUser)
router.get('/getAll', authMiddleware, UserController.getAllUser)
router.post('/refresh-token', UserController.refreshToken)

module.exports = router