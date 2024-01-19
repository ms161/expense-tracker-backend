const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {

    try {
        const token = req.header('auth')
        console.log('this is token>>>>>>>',token)
        const data = jwt.verify(token, 'secretkey')
        const user = await User.findByPk(data.userId)
        req.user = user
        next()

    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: "something went wrong" });
    }

}