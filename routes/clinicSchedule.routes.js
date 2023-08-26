const express = require('express');
const app = express();
app.use(express.json());
const Route = express.Router();

let clinicModel = require('../model/clinicSchedule');

Route.route('/getClinic').get(async function (req, res) {
    try {
      const c = await clinicModel.find();
      res.json(c);
    } catch (err) {
      console.log(err);
    }
  });

  Route.route('/clinicSearch').post(async function (req, res) {
    const { dspecialty, cancertype, date } = req.body;
  
    const query = {};
  
    if (dspecialty) {
      query.dspecialty = { $regex: new RegExp(dspecialty, 'i') };
    }
  
    if (date) {
      query.date = { $eq: new Date(date) };
    }  
  
    if (cancertype) {
      query.cancertype = { $regex: new RegExp(cancertype, 'i') };
    }
  
    const clinics = await clinicModel.find(query);
  
    // const filteredClinics = clinics.filter(clinic => clinic.date === date);

  res.json(clinics);
  });
  
  

  Route.route('/addClinic').post(async function (req, res) {
    try {
      const complaintSV = new clinicModel({
        dname: req.body.dname,
        dspecialty: req.body.dspecialty,
        cancertype: req.body.cancertype,
        date: req.body.date,
        time: req.body.time
      });
      await complaintSV.save();
       res.status(200).json({ 'employee': 'Added Successfully' });     
    } catch (err) {
      res.status(400).send("Something Went Wrong");
    }
  });


  Route.route('/editClinic/:id').get(async function (req, res) {
    try {
      const id = req.params.id;
      const employee = await clinicModel.findById(id);
      res.json(employee);
    } catch (err) {
      res.status(400).send("Something Went Wrong");
    }
  });
  
 
 Route.route('/updateClinic/:id').post(async function (req, res) {
    try {
      const employee = await clinicModel.findById(req.params.id);
      if (!employee) {
        return next(new Error('Unable To Find Employee With This Id'));
      } else {
        employee.dname = req.body.dname;
        employee.dspecialty = req.body.dspecialty;
        employee.cancertype = req.body.cancertype;
        employee.date = req.body.date;
        employee.time = req.body.time;
   
        const updatedEmployee = await employee.save();
        res.json('Updated Successfully');
      }
    } catch (err) {
      res.status(400).send("Unable To Update Employee");
    }
  });


  Route.route('/deleteClinic/:id').get(async function (req, res) {
    try {
      const delcom = await clinicModel.findByIdAndRemove({ _id: req.params.id });
      if (!delcom) {
        return res.status(404).json({ message: 'not found' });
      }
      res.status(200).json({ message: 'Deleted Successfully'});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  module.exports = Route;