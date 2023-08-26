const express = require('express');
const app = express();
app.use(express.json());
const feedbackRoute = express.Router();

let feedbackModel = require('../model/feedback');

feedbackRoute.route('/getFeedback').get(async function (req, res) {
    try {
      const fb = await feedbackModel.find();
      res.json(fb);
    } catch (err) {
      console.log(err);
    }
  });

feedbackRoute.route('/addfeedback').post(async function (req, res) {
    try {
      // const employee = new employeeModel(req.body);
      const fb = new feedbackModel({
        feedback: req.body.feedback,
      });
      await fb.save();
       res.status(200).json({ '': ' Added Successfully' });      
    } catch (err) {
      res.status(400).send("Something Went Wrong");
    }
  });

  feedbackRoute.route('/deleteFeedback/:id').get(async function (req, res) {
    try {
      const deletedFeedback = await feedbackModel.findByIdAndRemove({ _id: req.params.id });
      if (!deletedFeedback) {
        return res.status(404).json({ message: 'not found' });
      }
      res.status(200).json({ message: 'Deleted Successfully'});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  module.exports = feedbackRoute;