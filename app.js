const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express()
const user=require('./routes/userRoutes')
const sequelize=require('./util/database')

app.use(bodyParser.json())
app.use(cors())



app.use(user)


sequelize.sync().then(()=>{

    app.listen(5000)
})
.catch((err)=>{
    console.log(err)
})