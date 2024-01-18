
const User = require('../models/user')

exports.signUp = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const user = await User.findAll({ where: { email: email } })

        if (user.length > 0) {
            return res.status(400).json({ message: 'user already exists' })
        }

        const resp = await User.create({
            name,
            email,
            password
        })
        res.status(201).json({ message: 'user created successfull' })
    }
    catch (err) {
        console.log(err)
    }
}

exports.login = async (req, res) => {
try
    {const email = req.body.email
    const password = req.body.password

    const user = await User.findAll({ where: { email: email } })
    if (user.length > 0) {
        const userPassword = user[0].dataValues.password
        if (password === userPassword) {
            return res.status(200).json({ message: 'User login sucessful' })
        }
        else {
            return res.status(401).json({ message: 'User not authorized' })
        }

    }
    else {
        res.status(404).json({ message: 'User not found' })
    }}
    catch(err){
    res.status(500).json({error:err})
    }
}
