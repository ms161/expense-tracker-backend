const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express()


//ROUTES
const user=require('./routes/userRoutes')
const expense=require('./routes/expenseRoutes')
const sequelize=require('./util/database')

const User=require('./models/user')
const Expense=require('./models/userExpense')

app.use(bodyParser.json())
app.use(cors())

User.hasMany(Expense)
Expense.belongsTo(User)

app.use(user)
app.use('/expense',expense)

sequelize
.sync({force:false})
.then(()=>{

    app.listen(5000)
})
.catch((err)=>{
    console.log(err)
})
