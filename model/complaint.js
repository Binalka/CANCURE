const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
 
 const Complaint = new Schema({
    email: {
        type: String
    },
    complaint: {
        type: String
    },
    joined: { type: Date, default: Date.now }
 },{
 collection: 'complaints'
 });

 module.exports = mongoose.model('Complaint', Complaint);