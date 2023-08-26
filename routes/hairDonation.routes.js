const express = require('express');
const app = express();
app.use(express.json());
const Route = express.Router();
const nodemailer = require('nodemailer');

let hairDonationModel = require('../model/hairDonation');

Route.route('/gethair').get(async function (req, res) {
    try {
      const fb = await hairDonationModel.find();
      res.json(fb);
    } catch (err) {
      console.log(err);
    }
  });

  // count
  Route.route('/countHairDonationAppoinmnet').get(async function (req, res) {
    try {
      const count = await hairDonationModel.countDocuments({});
      const availableSeats = 20 - count;
      res.status(200).send({ count });
     
    } catch (err) {
      console.error(err);
      res.status(500).send('Error counting');
    }
  });

  Route.route('/hairDonationSearch').post(async function (req, res) {
    const { date } = req.body;
  
    const query = {};

    if (date) {
      query.date = { $eq: new Date(date) };
    }  
  
    const hair = await hairDonationModel.find(query);
  
    res.json(hair);
  });


  Route.route('/addhair').post(async function (req, res) {
    try {
      // const employee = new employeeModel(req.body);
      const fb = new hairDonationModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
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
          subject: 'Hair Donation Confirmation',
          html: '<h1>Hi ' + req.body.name + ' Welcome to Cancure (Canser Hospital Management System) </h1><br><p>Your date is confirmed to donate your hair for cancer patient</p><br><p>Vanue: Cancer Hospital, 1004 Hall</p>'
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

  Route.route('/deletehair/:id').get(async function (req, res) {
    try {
      const del = await hairDonationModel.findByIdAndRemove({ _id: req.params.id });
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