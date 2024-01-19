
const express=require('express')
const router=express.Router()
const auth=require('../middlewares/authentication')

const expenseController=require('../controllers/expenseControllers')

router.post('/postExpense',auth.auth,expenseController.postExpense)

router.get('/getExpenses',auth.auth,expenseController.getAllExpenses)

router.delete('/deleteExpense/:id',auth.auth,expenseController.deleteExpense)

module.exports=router