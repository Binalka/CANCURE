const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const Payment = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    nic: {
        type: Number
    },
    // pay: {
    //     type: Number
    // },
    joined: { type: Date, default: Date.now }
 },{
 collection: 'payments'
 });
 
 module.exports = mongoose.model('Payment', Payment);



// const mongoose = require('mongoose');

// const PaymentSchema = new mongoose.Schema({
//   amount: { type: Number, required: true },
//   currency: { type: String, required: true },
//   status: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const Payment = mongoose.model('Payment', PaymentSchema);

// module.exports = Payment;

