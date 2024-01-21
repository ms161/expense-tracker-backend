const User = require('../models/user')
const Expense = require('../models/userExpense')

exports.showLeaderboard = async (req, res) => {
    const user = await User.findAll()
    const expense = await Expense.findAll()

    const obj = {}
    expense.forEach((e) => {
        if (obj[e.userId]) {
            obj[e.userId] += e.amount
        }
        else {
            obj[e.userId] = e.amount
        }
    })
let userLeaderBoard=[]
    user.forEach((e)=>{
        userLeaderBoard.push({name:e.name,total_cost:obj[e.id]})

    })
    console.log(userLeaderBoard)
    // console.log(obj)

    res.json(user)

}
