const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const Hairdonation = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    date: {
        type: Date
    },
    joined: { type: Date, default: Date.now }
 },{
 collection: 'hairdonations'
 });

 module.exports = mongoose.model('Hairdonation', Hairdonation);