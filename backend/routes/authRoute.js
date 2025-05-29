const express = require('express');
const router = express.Router();
const {login,register}=require("../Controllers/authControllers");
const auth =require("../middleware/auth");
const joi = require('joi');
const validation = require("express-joi-validation").createValidator({});

const registerSchema = joi.object({
    username:joi.string().min(3).max(16).required(),
    password:joi.string().min(8).max(32).required(),
    mail:joi.string().email().required()
})

const loginSchema = joi.object({
    password:joi.string().min(8).max(32).required(),
    mail:joi.string().email().required()
})

router.post("/register",validation.body(registerSchema), register)

router.post("/login",validation.body(loginSchema), login)

router.get("/test",auth,(req,res)=>{
    res.send("Hello")
})

module.exports = router