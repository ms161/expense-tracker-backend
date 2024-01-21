const sequelize = require('sequelize')
const User = require('../models/user')
const Expense = require('../models/userExpense')

exports.showLeaderboard = async (req, res) => {
    const userLeaderboard = await User.findAll({
        attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost']], 
        include:[
            {
                model:Expense, 
                attributes:[]
            }
        ],
        group: ['user.id'],
        order:[[sequelize.col('total_cost'),'DESC']]
    })
    
   

    res.json(userLeaderboard)

}
