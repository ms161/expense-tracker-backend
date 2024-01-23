const express=require('express')
const router=express.Router()
const premiumController=require('../controllers/premiumController')
const auth=require('../middlewares/authentication')

router.get('/showLeaderboard',premiumController.showLeaderboard)

router.get('/download',auth.auth,premiumController.downloadExpense)

module.exports=router