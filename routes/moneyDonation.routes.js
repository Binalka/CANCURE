const express = require('express');
const app = express();
app.use(express.json());
const Route = express.Router();
const nodemailer = require('nodemailer');

let moneyDonationModel = require('../model/moneyDonation');

Route.route('/getmoney').get(async function (req, res) {
    try {
      const fb = await moneyDonationModel.find();
      res.json(fb);
    } catch (err) {
      console.log(err);
    }
  });

  Route.route('/addmoney').post(async function (req, res) {
    try {
      // const employee = new employeeModel(req.body);
      const fb = new moneyDonationModel({
        name: req.body.name,
        email: req.body.email,
        nic: req.body.nic,
        pay: req.body.pay
      });
      await fb.save();

      // Send email to user
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
      
        auth: {
            user: 'cancure.service@gmail.com', // email address
            pass: 'nwzixrfaujvyzdwk' // email password
        }
        });
  
        // let mailOptions = {
        //   from: 'cancure.service@gmail.com',
        //   to: req.body.email,
        //   subject: 'Money Donation Confirmation',
        //   html: '<h1>Hi ' + req.body.name + ' Welcome to Cancure (Canser Hospital Management System) </h1><br><p>Your LKR'+req.body.pay+' money donation is accepted by CANCURE</p><br><p>Thank you</p>'
        // };

        let certificateHtml = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Donation Certificate</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
            
              line-height: 1.5;
              margin: 0;
              padding: 0;
              
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 50px;
              box-sizing: border-box;
    background-image: url('https://png.pngtree.com/png-vector/20220810/ourmid/pngtree-red-certificate-border-design-in-black-and-gold-color-combination-png-image_6105731.png');
    background-repeat: no-repeat;
    
             
              
            }
            h1 {
              font-size: 36px;
              margin-bottom: 20px;
              color: #33003d;
            }
            p {
              margin-bottom: 10px;
            }
            img {
             
              margin: 10px;
              width: 70px;
              height: 70px;
              margin-left: 300px;
              margin-bottom: 150px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Donation Certificate</h1>
            <p>Hi <b>` + req.body.name + `</b>,</p>
            <p>Welcome to Cancure (Cancer Hospital Management System).</p>
            <p>Your <b>LKR` + req.body.pay + `.00</b> money donation is accepted by CANCURE.</p>
            <p>Thank you for your contribution.</p>
            // <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJmRWWPNjoBGfRwsVy0aDISbmAs9W32zmHnstmUhrfSZixcWlyjfNget7p-IywzEehgaU&usqp=CAU" alt="Donation Certificate">
          </div>
        </body>
        </html>
        `;

        let mailOptions = {
          from: 'cancure.service@gmail.com',
          to: req.body.email,
          subject: 'Money Donation Confirmation',
          // html: '<h1>Hi ' + req.body.name + ',</h1><br><p>Welcome to Cancure (Cancer Hospital Management System).</p><br><p>Your LKR '+ req.body.pay +' money donation is accepted by CANCURE.</p><br><p>Thank you for your contribution.</p><br><br><img src="https://example.com/certificate.png" alt="Donation Certificate" width="500" height="500">'
          html: certificateHtml
        };

  
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent: ' + info.response);
          }
         });
       res.status(200).json({ '': 'Added Successfully' });      
    } catch (err) {
      res.status(400).send("Something Went Wrong");
    }
  });

  Route.route('/deletemoney/:id').get(async function (req, res) {
    try {
      const del = await moneyDonationModel.findByIdAndRemove({ _id: req.params.id });
      if (!del) {
        return res.status(404).json({ message: 'not found' });
      }
      res.status(200).json({ message: 'Deleted Successfully'});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  module.exports = Route;