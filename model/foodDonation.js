const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const FoodDonation = new Schema({
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
    des: {
        type: String
    },
    time: {
        type: String
    },
    donate: {
        type: String,
        default: "BOOKED",
      },
    joined: { type: Date, default: Date.now }
 },{
 collection: 'foodDonations'
 });

 module.exports = mongoose.model('FoodDonation', FoodDonation);