const express=require('express')
const router=express.Router()

const purcchaseController = require('../controllers/purchase');
const auth=require('../middlewares/authentication')
router.get('/premiummembership', auth.auth, purcchaseController.purchasePremium);
router.post('/updatetransactionstatus', auth.auth, purcchaseController.updateTransactionStatus);
router.post('/updateTransactionFailedStatus', auth.auth, purcchaseController.updateFailedTransactionStatus);
module.exports=router