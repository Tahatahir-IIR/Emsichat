const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const register = async(req,res)=>{
    try{
        const{username,mail,password}=req.body
        const userExists = await User.exists({mail:mail.toLowerCase()})
        if(userExists){
            return res.status(409).send("Email already used in another account")
        }
        const encryptPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            username,
            mail,
            password:encryptPassword
        })

        const token =  jwt.sign({
            userId : user._id,
            mail
        },
        process.env.JWT_SECRET,{expiresIn:'24h'}
        
        )

        res.status(200).json({
            userDetails:{
                mail:user.mail,
                username:user.username,
                token:token
            }
        })
    }catch(error){

    }
};

module.exports= register;
