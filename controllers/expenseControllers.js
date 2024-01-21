const sequelize = require('../util/database');
const User=require('../models/user')
const Expense = require('../models/userExpense')

function Invalidstring(str) {
    if (str.trim().length == 0 || str == undefined) {
        return true;
    } else {
        return false;
    }
}

exports.postExpense = async (req, res) => {
   const t = await sequelize.transaction()
    try {
       
       
        const { amount, description, category } = req.body
        console.log('this is id', req.user)
        if (Invalidstring(amount) || Invalidstring(description) || Invalidstring(category)) {
            return res.status(400).json({ message: 'All the fields are mandatory' })
        }
        const resp = await Expense.create({
            amount,
            description,
            category,
            userId: req.user.id,


        }, { transaction: t })

        //MAGIC ASSOCIATION 
        // const resp=req.user.createExpense({amount,
        //     description,
        //     category,
        // })
        const totalExpense = Number(req.user.totalExpense) + Number(amount);
        console.log('amount', totalExpense);
        await User.update({
            totalExpense: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t

        })
        await t.commit()
        res.status(201).json(resp)

    }
    catch (err) {
     
            await t.rollback();
      
        console.log(err)
        res.json({ error: err })
    }

}

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } })
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
    const t = await sequelize.transaction(); 
    try {
        const id = req.params.id
     
        const price = await Expense.findAll({where:{id:id}});

        const resp = await Expense.destroy({ where: { id: id, userId: req.user.id } })
        const totalExpense = Number(req.user.totalExpense) - Number(price[0].amount);

        await User.update({
            totalExpense: totalExpense
        },{
            where:{id: req.user.id},
            transaction : t
        })

        await t.commit();
        res.status(200).json(resp)
    }
    catch (err) {
        await t.rollback();
        console.log(err)

        res.status(500).json({message:err});
    }
}
