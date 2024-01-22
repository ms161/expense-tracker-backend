const express=require('express')
const router=express.Router() 
const passwordController=require('../controllers/passwordController')

router.post('/forget-password',passwordController.forgetPassword)


module.exports=router