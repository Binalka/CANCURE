 const express = require('express');
 const nodemailer = require('nodemailer');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');

 const app = express();
 app.use(express.json());
 const employeeRoute = express.Router();
 
 let employeeModel = require('../model/user');

 employeeRoute.route('/getuser').get(async function (req, res) {
    try {
      const employees = await employeeModel.find();
      res.json(employees);
    } catch (err) {
      console.log(err);
    }
  });


employeeRoute.route('/addEmployee').post(async function (req, res) {
    try {
      const name = req.body.name;
      const nic = req.body.nic;
      const email = req.body.email;
      const phone = req.body.phone;
      const password =  req.body.password ;

      const salt = await bcrypt.genSalt(10);
      const shpass = await bcrypt.hash(password, salt);

      const newEmployee = new employeeModel({
        name,
        nic,
        email,
        phone,
        password : shpass
      });

      await newEmployee.save();

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
          subject: 'Registration Confirmation',
          html: '<h1>Hi ' + req.body.name + ' Welcome to Cancure</h1><p>Thank you for registering with us.</p>'
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
      console.log(err.message);
      res.status(400).send("Error in Saving");
    }
  });


  employeeRoute.route('/login').post(async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      const employee = await employeeModel.findOne({ email: email });
      if (!employee) {
        return res.status(401).send({ message: 'Authentication failed. User not found.' });
      }
    
      if (!employee || !employee.password) {
        return res.status(400).send({ message: 'Bad request. Employee object or password is null or undefined.' });
      }
    
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: 'Authentication failed. Wrong password.' });
      }
    
      return res.status(200).send({ message: 'Authentication successful.' });
    
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });

  employeeRoute.route('/forgotPassword').post(async function (req, res) {
    const { email } = req.body;
  
    try {
      const user = await employeeModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Email not found' });
      }
  
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        
        auth: {
          user: 'cancure.service@gmail.com', // email address
          pass: 'nwzixrfaujvyzdwk' // email password
        }
      });
  
      const mailOptions = {
        from: 'cancure.service@gmail.com',
        to: req.body.email,
        subject: 'Verify your email address',
        html: `<p>Welcome to CANCURE,</p><p>Please click on the following link to verify your email address:</p><p><a href="http://localhost:3000/setPassword">Verify email</a></p>`,
      };
  
      const sendEmail = transporter.sendMail(mailOptions);
  
      await sendEmail;
  
      if (res.headersSent) {
        return;
      }
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  employeeRoute.route('/setNewPassword').post(async function (req, res) {
    try {
      //reset password
      const { email } = req.body;
      const userReset = await employeeModel.findOne({ email });
      if (!userReset) {
        return res.status(404).json({ message: 'Email not found' });
      }
      userReset.password = ""; // Deletes the password value
      await userReset.save();
  
      // set new password
      const { password } = req.body;
      const user = await employeeModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Email not found' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const shpass = await bcrypt.hash(password, salt);
  
      user.password = shpass;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


 employeeRoute.route('/editEmployee/:id').get(async function (req, res) {
    try {
      const id = req.params.id;
      const employee = await employeeModel.findById(id);
      res.json(employee);
    } catch (err) {
      res.status(400).send("Something Went Wrong");
    }
  });
  
 
 employeeRoute.route('/updateEmployee/:id').post(async function (req, res) {
    try {
      const employee = await employeeModel.findById(req.params.id);
      if (!employee) {
        return next(new Error('Unable To Find Employee With This Id'));
      } else {
        employee.name = req.body.name;
        employee.nic = req.body.nic;
        employee.email = req.body.email;
        employee.phone = req.body.phone;
        employee.password = req.body.password;
   
        const updatedEmployee = await employee.save();
        res.json('Employee Updated Successfully');
      }
    } catch (err) {
      res.status(400).send("Unable To Update Employee");
    }
  });
  
 
 employeeRoute.route('/deleteEmployee/:id').get(async function (req, res) {
    try {
      const deletedEmployee = await employeeModel.findByIdAndRemove({ _id: req.params.id });
      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({ message: 'Employee Deleted Successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
 
 module.exports = employeeRoute;