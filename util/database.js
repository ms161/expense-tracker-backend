const Sequelize=require('sequelize')

const sequelize=new Sequelize('expense-tracker','root','nodecomplete', {
    dialect: 'mysql',
    host: 'localhost'
  })
  module.exports = sequelize;
