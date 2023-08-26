const express = require('express');
const app = express();
app.use(express.json());
const complaintRoute = express.Router();

let complaintModel = require('../model/complaint');

complaintRoute.route('/getComplaint').get(async function (req, res) {
    try {
      const c = await complaintModel.find();
      res.json(c);
    } catch (err) {
      console.log(err);
    }
  });

  complaintRoute.route('/addcomplaint').post(async function (req, res) {
    try {
      const complaintSV = new complaintModel({
        email: req.body.email,
        complaint: req.body.complaint,
      });
      await complaintSV.save();
       res.status(200).json({ message: 'Complaint added successfully' });  
    } catch (err) {
      res.status(400).send("Something Went Wrong");
    }
  });

  complaintRoute.route('/deleteComplaint/:id').get(async function (req, res) {
    try {
      const delcom = await complaintModel.findByIdAndRemove({ _id: req.params.id });
      if (!delcom) {
        return res.status(404).json({ message: 'not found' });
      }
      res.status(200).json({ message: 'Deleted Successfully'});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  module.exports = complaintRoute;