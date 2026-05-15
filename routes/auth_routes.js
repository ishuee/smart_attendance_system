const express=require('express');
const router=express.Router();
const {login}=require('../Controllers/auth_controllers');

router.post('/login',login)

module.exports=router 