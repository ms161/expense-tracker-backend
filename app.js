const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()


//ROUTES
const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const purchaseRoutes = require('./routes/purchaseRoutes')
const premiumRoutes = require('./routes/premiumRoutes')
const passwordRoutes = require('./routes/passwordRoutes')
//ROUTES
const sequelize = require('./util/database')

const User = require('./models/user')
const Order = require('./models/orders')

const Expense = require('./models/userExpense')

app.use(bodyParser.json())
app.use(cors())

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

app.use(userRoutes)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumRoutes)
app.use('/password', passwordRoutes)

sequelize
    .sync({ force: false })
    .then(() => {

        app.listen(5000)
    })
    .catch((err) => {
        console.log(err)
    })
