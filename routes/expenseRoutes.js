
const express=require('express')
const router=express.Router()

const expenseController=require('../controllers/expenseControllers')

router.post('/postExpense',expenseController.postExpense)

router.get('/getExpenses',expenseController.getAllExpenses)

module.exports=router