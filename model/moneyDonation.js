const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const Moneydonation = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    nic: {
        type: String
    },
    pay:{
        type: Number
    },
    joined: { type: Date, default: Date.now }
 },{
 collection: 'moneydonations'
 });

 module.exports = mongoose.model('Moneydonation', Moneydonation);