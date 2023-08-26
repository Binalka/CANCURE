const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const Employee = new Schema({
    name: {
        type: String
    },
    nic: {
        type: Number
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    password: {
        type: String
    },
   
    joined: { type: Date, default: Date.now }
 },{
 collection: 'users'
 });

 module.exports = mongoose.model('userDetails', Employee);