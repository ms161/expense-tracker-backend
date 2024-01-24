const Razorpay = require('razorpay');
const Order = require('../models/orders')
const userController = require('./userController');
require('dotenv').config();

const jwt = require('jsonwebtoken')

const generateAcessToken= (id, name,ispremiumuser)=> {
    return jwt.sign({ userId: id, name: name ,ispremiumuser:ispremiumuser},process.env.TOKEN_SECRET)
}

exports.purchasePremium = async (req, res) => {
    try {
        console.log('keyid',process.env.RAZORPAY_KEY_ID)
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 25000;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                console.log('we got a err')
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

exports.updateTransactionStatus = async (req, res ) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}}) 
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ ispremiumuser: true }) 
console.log('update transaction c>>>>>>>>>>>>')
        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({success: true, message: "Transaction Successful",
            token: generateAcessToken(userId,undefined , true) });
        }).catch((error ) => {
            throw new Error(error)
        }) 
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })
    }
}


exports.updateFailedTransactionStatus = async (req, res ) => {
    try {
        const userId = req.user.id;
        const {order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}}) 
        await order.update({status: 'FAILED'}) 
        return res.status(202).json({success: true, message: "Payment status updated",
            token: userController.generateToken(userId,undefined ,false) });
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })
    }
}