const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express()


//ROUTES
const user=require('./routes/userRoutes')
const expense=require('./routes/expenseRoutes')
const purchase=require('./routes/purchaseRoutes')
const premium=require('./routes/premiumRoutes')
//ROUTES
const sequelize=require('./util/database')

const User=require('./models/user')
const Order=require('./models/orders')


const Expense=require('./models/userExpense')

app.use(bodyParser.json())
app.use(cors())

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

app.use(user)
app.use('/expense',expense)
app.use('/purchase',purchase)
app.use('/premium',premium)

sequelize
.sync({force:false})
.then(()=>{

    app.listen(5000)
})
.catch((err)=>{
    console.log(err)
})
