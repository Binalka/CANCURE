const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
 const Feedback = new Schema({
    feedback: {
        type: String
    },
    joined: { type: Date, default: Date.now }
 },{
 collection: 'feedbacks'
 });

 module.exports = mongoose.model('Feedback', Feedback);