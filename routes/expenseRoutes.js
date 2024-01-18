
const express=require('express')
const router=express.Router()

const expenseController=require('../controllers/expenseControllers')

router.post('/postExpense',expenseController.postExpense)

router.get('/getExpenses',expenseController.getAllExpenses)

router.post('/deleteExpense/:id',expenseController.deleteExpense)

module.exports=router