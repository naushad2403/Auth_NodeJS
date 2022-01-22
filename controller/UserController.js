const User = require('../model/user')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { use } = require('../routes');
const { status } = require('express/lib/response');
class UserController {
    constructor  () { } 

    validateUsername (req, res, next) {
        console.log("======REQ ", req.body)
        const {userName} = req.body;
        let regex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
        console.log("Username", regex.test(userName));
        if(!regex.test(userName)) return res.status(400).send({msg: `Username should be combination of alphabet, numbers and _. Length should be between 8 to 30`})
        next ();
    }

    validateEmail (req, res, next) {
        const {email} = req.body;
        var emailCheck=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        if(!emailCheck.test(email)) return res.status(400).send({msg: `Please enter a valid email id`})
        next ();
    }

    validatePassword (req, res, next) {
        const {password} = req.body;
        var passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
         if(!passwordCheck.test(password)) return res.status(400).send({
            msg: `Password  should be minimum eight characters, at least one letter, one number and one special character required`
         });
        next ();
    }

    async checkIfUserAlreadyExist (req, res, next) {
        const {email} = req.body;
        const oldUser =  await User.findOne({ email });
        if (oldUser) return res.status(409).send("User Already Exist. Please Login");
        next ();
    }

    async createNewUser(req, res, next) {
        const {userName, email, password} = req.body;
        let encryptedPassword  = await bcrypt.hash(password, 10);
        const user = await new User({
            userName,
            email: email.toLowerCase(),
            password: encryptedPassword
            });
        const token  = jwt.sign({user_id: user._id, email },      
                                process.env.AUTH_TOKEN_KEY,
                                {expiresIn: "2h"})   
        
      // save user token
      user.token = token;
      await user.save();
      // return new user
      return res.status(201).json(user);

    }

    async login (req, res) {
        const {userName, password} = req.body;
        let user  = await User.findOne({userName});
        if(!user) return res.status(400).send({msg: `Invalid credentials`});
        let isIqual = await bcrypt.compare(password, user.password);
        if(!isIqual) return res.status(400).send({msg: `Invalid credentials`});
        const token = jwt.sign({
            user_id: user._id, email: user.email
        }, process.env.AUTH_TOKEN_KEY, {
            expiresIn: "2h"
        });
        user.token = token;
        await user.save();
        return res.status(200).send({'token':token});
    }   
}

module.exports = new UserController();