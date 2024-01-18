const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express()

//ROUTES
const user=require('./routes/userRoutes')
const expense=require('./routes/expenseRoutes')
const sequelize=require('./util/database')


app.use(bodyParser.json())
app.use(cors())



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