const express = require('express');
const app = express();
app.use(express.json());
const Route = express.Router();
const nodemailer = require('nodemailer');

let appoinmentModel = require('../model/doctorAppoinment');

Route.route('/getAppoinment').get(async function (req, res) {
    try {
      const fb = await appoinmentModel.find();
      res.json(fb);
    } catch (err) {
      console.log(err);
    }
  });

  // count
  Route.route('/countSpace').get(async function (req, res) {
  try {
    const date = req.body.date;
    const count = await appoinmentModel.countDocuments({});
    const availableSeats = 20 - count;
    res.status(200).send({ count: count, availableSeats: availableSeats });
    // res.status(200).send({ count: count });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error counting');
  }
});

  Route.route('/addAppoinment').post(async function (req, res) {
    try {
      const fb = new appoinmentModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        dname: req.body.dname,
        cancertype: req.body.cancertype,
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
          subject: 'Doctor Appoinment Confirmation',
          html: '<h1>Hi ' + req.body.name + ' <br>Welcome to Cancure (Canser Hospital Management System) </h1><p> Your Appoinmnent Confirmed</p><br><p>Doctor Name: '+ req.body.dname+'</p><p>Appoinment Date: '+ req.body.date+'</p><p>Doctor Name: '+ req.body.dname+'</p><p>Vanue: Cancer Hospital, 002 Hall</p><br><p>Thank you</p>'
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

  Route.route('/deleteAppoinment/:id').get(async function (req, res) {
    try {
      const del = await appoinmentModel.findByIdAndRemove({ _id: req.params.id });
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