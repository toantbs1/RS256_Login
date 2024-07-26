const express = require('express');
const router = express.Router()
const UserController = require('../controllers/UserController')

router.post('/sign-up', UserController.createUser)
router.post('/sign-in', UserController.loginUser)
router.put('/update/:id', UserController.updateUser)
router.delete('/delete/:id', UserController.deleteUser)
router.post('/log-out', UserController.logoutUser)
router.post('/refresh-token', UserController.refreshToken)

module.exports = router