const express=require('express')
const router=express.Router()
const premiumController=require('../controllers/premiumController')


router.get('/showLeaderboard',premiumController.showLeaderboard)

module.exports=router