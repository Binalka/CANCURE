const express = require('express');
const app = express();
app.use(express.json());
const Route = express.Router();
const nodemailer = require('nodemailer');

let foodDonationModel = require('../model/foodDonation');

Route.route('/b').post(async function (req, res) {
  const { name, email, date } = req.body;

  const bookingCount = await foodDonationModel.countDocuments({ date });

  if (bookingCount >= 10) {
    return res.status(400).json({ message: 'Booking is full' });
  }

  const booking = new foodDonationModel({ name, email, date });
  await booking.save();

  res.json({ message: 'Booking successful' });
});

Route.route('/getFoodDonation').get(async function (req, res) {
    try {
      const fb = await foodDonationModel.find();
      res.json(fb);
    } catch (err) {
      console.log(err);
    }
  });

  Route.route('/foodDateSearch').post(async function (req, res) {
    const { date, time } = req.body;

    const query = {};

    if (date) {
      query.date = { $eq: new Date(date) };
    }

    if (time) {
      query.time = { $regex: new RegExp(time, 'i') };
    }

    const don = await foodDonationModel.find(query);

    res.json(don);
  });

  Route.route('/addFoodDonation').post(async function (req, res) {
    try {
      const date = req.body.date;
      const count = await foodDonationModel.countDocuments({  date: date });
      if (count >= 3) {
        res.status(400).send('Already date Booked');
        return;
      }

      const time = req.body.time;
      if (time) {
        const c = await foodDonationModel.countDocuments({ date: date , time: time });
        if (c >= 1) {
          res.status(400).send('Already date and time Booked');
          return;
        }
      }

      // const employee = new employeeModel(req.body);
      const fb = new foodDonationModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        date: req.body.date,
        des: req.body.des,
        time: req.body.time
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
          subject: 'Food Donation Confirmation',
          html: '<h1>Hi ' + req.body.name + ' Welcome to Cancure </h1><br><p>Your selected '+req.body.date+ ' date and time ' +req.body.time+ 'is confirmed to donate food for cancer patient. Please come and donate on comfirmed date.</p><br><p>Vanue: Cancer Hospital, Food Donation Section</p>'
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
      console.log(err);
    }
  });
 

  Route.route('/deleteFoodDonation/:id').get(async function (req, res) {
    try {
      const del = await foodDonationModel.findByIdAndRemove({ _id: req.params.id });
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