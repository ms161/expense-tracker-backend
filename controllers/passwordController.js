
const Sib = require('sib-api-v3-sdk')
const User = require('../models/user')
const bcrypt=require('bcrypt');
const UUID = require('uuid');
const ForgotPasswordRequests = require('../models/ForgotPasswordRequests')
require('dotenv').config()



exports.forgetPassword = async (req, res) => {
    console.log(req.body.email)
    try {

        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } })
        console.log(user.dataValues.id)
        if (user) {
            const id = UUID.v4()
           await ForgotPasswordRequests.create({
                id: id,
                active: true,
                userId: user.dataValues.id

            })
console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',id)
            const client = Sib.ApiClient.instance
            const apiKey = client.authentications['api-key']

            apiKey.apiKey = process.env.API_KEY
         
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
                subject: `Reset Password`,
                htmlContent: `<h1>click on the link below to reset the password</h1><br>
                <a href="http://localhost:5000/password/resetpassword/${id}">Reset your Password</a>`
            })

            return res.status(202).json({success: true, message: "password mail sent Successful"});
        }
        else {
            throw new Error('User Does not exist');
        }
    }
    catch (err) {
        console.log(err)
        return res.json({ message: err, success: false });
    }
}

exports.resetPassword=async(req,res)=>{
   try{ const id=req.params.id 
    const pass=await ForgotPasswordRequests.findOne({where:{id:id}})
    console.log(pass.dataValues)
    if(pass.dataValues.active){
        // await pass.update({active:false})
        res.status(201).send(`<html>
        <style>
        @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');
        *{
          margin: 0;
          padding: 0;
          outline: none;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }
        body{
          height: 100vh;
          width: 100%;
          background: linear-gradient(115deg, #56d8e4 10%, #f55ee6 90%);
        }
        
        .container{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          width: 410px;
          padding: 30px;
          box-shadow: 0 0 8px rgba(0,0,0,0.1);
        }
        
        .container .text{
          font-size: 35px;
          font-weight: 600;
          text-align: center;
        }
        .container form{
          margin-top: -20px;
        }
        .container form .data{
          height: 45px;
          width: 100%;
          margin: 40px 0;
        }
        form .data label{
          font-size: 18px;
        }
        form .data input{
          height: 100%;
          width: 100%;
          padding-left: 10px;
          font-size: 17px;
          border: 1px solid silver;
        }
        form .data input:focus{
          border-color: #f55ee6;
          border-bottom-width: 2px;
        }
        form .forgot-pass{
          margin-top: -8px;
        }
        form .forgot-pass a{
          color: #f55ee6;
          text-decoration: none;
        }
        form .forgot-pass a:hover{
          text-decoration: underline;
        }
        form .btn{
          margin: 30px 0;
          height: 45px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        
        form .btn button{
          height: 100%;
          width: 100%;
          background: linear-gradient(115deg, #56d8e4 10%, #f55ee6 90%);
          border: none;
          color: #fff;
          font-size: 18px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
        }
        
        form .btn:hover{
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.265);
        }
        </style>
        <body>
        <div class="center">
        <div class="container">
        <form onsubmit="onsub(event)">
            <div class="data">
                <label for="newpassword">Enter New password:</label>
                <input type="password" name="newpassword" id="pass" required>
            </div>
            <div class="btn">
                <div class="inner"></div>
                <button type="submit">reset password</button>
            </div>
        </form>
        </div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js"></script>
        <script>
          async function onsub(event){
            event.preventDefault();
            try{
              let pass = {
                pass: event.target.newpassword.value
                }
                let op = await axios.post("http://localhost:5000/password/updatepassword/${id}",pass);
                if(op.status==201){
                  alert('Password Reset Successfully');
                  window.close();
                }else{
                  throw new Error('failed to signup');
                }
                
            }catch(err){
              alert(err);
              console.log(err);
            }
          }
        </script>
      </body>
    </html>`
)
res.end();

    }
   }
   catch(err){
    console.log(err)
   }
}

exports.updatePassword = async(req, res) => {

    try {
        const newpassword = req.body.pass;
        const {id } = req.params;
        const resetpasswordrequest=await ForgotPasswordRequests.findOne({ where : { id: id }})
  
        const user=await User.findOne({where: { id : resetpasswordrequest.userId}})
                if(user) {
                  let saltRound=10;
                  bcrypt.hash(newpassword,saltRound,async(err,hash)=>{
                    if(err){
                        console.log(err)
                        throw new Error(err)
                    }
                    await User.update({password:hash},{where:{id:user.id}})
                    console.log('password change successfully');
                    res.status(201).json({message: 'Successfuly update the new password'})
                  })
                    
            } else{
              console.log("404",error)
                return res.status(404).json({ message: 'No user Exists', success: false})
            }
        
        
    } catch(error){
      console.log(error)
        return res.status(403).json({ error, success: false } )
    }
  
  }