const express = require('express');
const app = express();
app.use(express.json());
const Route = express.Router();
const nodemailer = require('nodemailer');

let eModel = require('../model/entertainment');

Route.route('/getE').get(async function (req, res) {
    try {
      const fb = await eModel.find();
      res.json(fb);
    } catch (err) {
      console.log(err);
    }
  });



  Route.route('/addE').post(async function (req, res) {
    try {
      // const employee = new employeeModel(req.body);
      const fb = new eModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        etype: req.body.etype,
        date: req.body.date
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
  
        let mailOptions = {
          from: 'cancure.service@gmail.com',
          to: req.body.email,
          subject: 'About your request',
          html: '<h1>Hi ' + req.body.name + ' Welcome to Cancure </h1><br><p>Your request is recived.We will follow through your details and We will contact you as soon as posible.</p><br><p>Thank You</p>'
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

  Route.route('/deleteE/:id').get(async function (req, res) {
    try {
      const del = await eModel.findByIdAndRemove({ _id: req.params.id });
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