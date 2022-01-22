const express = require('express')
const route = express.Router()
const UserController = require('../controller/UserController')
route.use((req, res, next)=>{
    console.log(`Request time ${Date.now()}`)
    next()
})
route.post('/register', [UserController.validateUsername, UserController.validateEmail, UserController.validatePassword, UserController.checkIfUserAlreadyExist], UserController.createNewUser)

route.post('/login', [UserController.validateUsername, UserController.validatePassword], UserController.login );
module.exports = route;