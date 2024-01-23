const sequelize = require('sequelize')
const User = require('../models/user')
const Expense = require('../models/userExpense')
const PreviousDownloads = require('../models/previousdownloads');
const S3services = require('../services/s3services');

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

exports.downloadExpense = async (req, res) => {
    try{
        const expenses = await req.user.getExpenses();

        const stringifiedExpenses = JSON.stringify(expenses);
        const userid = req.user.id;
        const filename = `Expenses${userid}/${new Date()}.txt`;
        const fileURL = await S3services.uploadToS3(stringifiedExpenses,filename); 
        const prevdata = await PreviousDownloads.create({ fileURL: fileURL,userId:userid})
        // const prevdata = await req.user.createPreviousDownloads({ fileURL: fileURL})
        //console.log(prevdata)
        res.status(200).json({fileURL:fileURL,prevdata:prevdata});
        
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
}
