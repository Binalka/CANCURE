const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const Appoinment = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    dname: {
        type: String
    },
    cancertype: {
        type: String
    },
    date: {
        type: Date
    },
    joined: { type: Date, default: Date.now }
 },{
 collection: 'appoinments'
 });

 module.exports = mongoose.model('Appoinment', Appoinment);