
const Sib = require('sib-api-v3-sdk')
require('dotenv').config()



exports.forgetPassword = async (req, res) => {
    console.log(req.body.email)
    try {
        const client = Sib.ApiClient.instance
        const { email } = req.body;
        const apiKey = client.authentications['api-key']

        apiKey.apiKey = process.env.API_KEY
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', process.env.API_KEY)
        const tranEmailApi = new Sib.TransactionalEmailsApi()

        const sender = {
            email: 'msehrawat161@gmail.com'
        }

        const receivers = [
            {
                email: email
            }
        ]
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: `this is demo`,
            textContent: `text content demo`
        })

        res.send('working')
    }
    catch (err) { console.log(err) }
}