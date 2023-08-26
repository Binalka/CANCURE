const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
const paymentRoute = express.Router();

let paymentModel = require('../model/payment');


// stripe
paymentRoute.route('/payment-handle').get(async function (req, res) {
  let status, error;
  const { token, amount } = req.body;

  try {
    await Stripe.charges.create({
      source: token.id,
      amount,
      currency: 'usd',
    });
    status = 'success';
  } catch (error) {
    console.log(error);
    status = 'Failure';
  }
  res.json({ error, status });
});

paymentRoute.route('/pay').post(async function (req, res) {
  try {
    // const employee = new employeeModel(req.body);
    const pay = new paymentModel({
      name: req.body.name,
      email: req.body.email,
      nic: req.body.nic
    });
    await pay.save();

    // setTimeout(() =>{

      // Send email to user
      let transporter = nodemailer.createTransport({
      service: 'Gmail',
    
      auth: {
          user: 'metrarailway@gmail.com', // your email address
          pass: 'bedbocjmzqrajjbl' // your email password
      }
      });
      

      let mailOptions = {
        from: 'metrarailway@gmail.com',
        to: req.body.email,
        //to: email,
        //to: 'kavinduhashan2k17@gmail.com',
        subject: 'Pay Successfully ',
        html: '<h1>Hi ' + req.body.name + 'Payment Successful</h1><p>succeful</p>'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
      });
      res.status(200).json({ 'employee': 'Payment Successfully' });      
      } catch (err) {
        res.status(400).send("Something Went Wrong");
      }


      
});


module.exports = paymentRoute;