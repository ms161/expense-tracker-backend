const Expense = require('../models/userExpense')

function Invalidstring(str){
    if(str.trim().length==0 || str == undefined){
        return true;
    }else{
        return false;
    }
}

exports.postExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body
        console.log('this is id',req.user)
        if(Invalidstring(amount) || Invalidstring(description) || Invalidstring(category)){
            return res.status(400).json({message:'All the fields are mandatory'})
        }
        const resp = await Expense.create({
            amount,
            description,
            category,
            userId:req.user.id 
        
        })

        //MAGIC ASSOCIATION 
        // const resp=req.user.createExpense({amount,
        //     description,
        //     category,
        // })

        res.status(201).json(resp)

    }
    catch (err) {
        console.log(err)
        res.json({ error: err })
    }

}

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({where:{userId:req.user.id}})
        //MAGIC ASSOCIATION METHOD
        // const expenses=await req.user.getExpense()
        console.log('this is expenses', expenses)
        res.status(200).json(expenses)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)

    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const resp = await Expense.destroy({ where: { id: id,userId:req.user.id } })
        res.status(200).json(resp)
    }
    catch (err) {
        console.log(err)

        res.json()
    }
}
