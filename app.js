const express = require('express')
const dotenv=require('dotenv')
dotenv.config()
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const sequelize = require('./util/database')
const helmet=require('helmet')
const morgan=require('morgan')
const fs=require('fs')
const path=require('path')


//ROUTES
const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const purchaseRoutes = require('./routes/purchaseRoutes')
const premiumRoutes = require('./routes/premiumRoutes')
const passwordRoutes = require('./routes/passwordRoutes')
//ROUTES

//MODELS
const User = require('./models/user')
const Order = require('./models/orders')
const Expense = require('./models/userExpense')
const ForgotPasswordRequests = require('./models/ForgotPasswordRequests')
//MODELS

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

app.use(helmet())
app.use(morgan('combined',{stream:accessLogStream}))
app.use(bodyParser.json())
app.use(cors())

//RELATIONS
User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPasswordRequests)
ForgotPasswordRequests.belongsTo(User)
//RELATIONS
app.use(userRoutes)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumRoutes)
app.use('/password', passwordRoutes)

sequelize
    .sync({ force: false })
    .then(() => {

        app.listen(process.env.PORT || 5000)
    })
    .catch((err) => {
        console.log(err)
    })
