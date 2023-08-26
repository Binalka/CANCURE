const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const Entertainment = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    etype: {
        type: String
    },
    date: {
        type: Date
    },
    joined: { type: Date, default: Date.now }
 },{
 collection: 'entertainments'
 });

 module.exports = mongoose.model('Entertainment', Entertainment);