const Expense = require('../models/userExpense')


exports.postExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body
        const resp = await Expense.create({
            amount,
            description,
            category
        })

        res.status(201).json(resp)

    }
    catch (err) {
        console.log(err)
        res.json({ error: err })
    }

}

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll()
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
        const resp = await Expense.destroy({ where: { id: id } })
        res.status(200).json(resp)
    }
    catch (err) {
        console.log(err)

        res.json()
    }
}