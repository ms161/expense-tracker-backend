
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateAcessToken= (id, name,ispremiumuser)=> {
    return jwt.sign({ userId: id, name: name,ispremiumuser:ispremiumuser },'secretkey')
}
exports.signUp = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const user = await User.findAll({ where: { email: email } })

        if (user.length > 0) {
            return res.status(400).json({ message: 'user already exists' })
        }
        const saltRounds = 10
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            const resp = await User.create({
                name,
                email,
                password: hash
            })
            res.status(201).json({ message: 'user created successfull' })
        })

    }
    catch (err) {
        console.log(err)
    }
}

exports.login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User.findAll({ where: { email: email } })
        if (user.length > 0) {
            const userPassword = user[0].dataValues.password
            bcrypt.compare(password, userPassword, (err, result) => {

                if (result) {
                    return res.status(200).json({ message: 'User login sucessful', token: generateAcessToken(user[0].dataValues.id, user[0].dataValues.name,user[0].dataValues.ispremiumuser) })
                }
                else {
                    return res.status(401).json({ message: 'User not authorized' })
                }
            })

        }
        else {
            res.status(404).json({ message: 'User not found' })
        }
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}
