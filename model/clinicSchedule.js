const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
 
 const ClinicSchedule = new Schema({
    dname: {
        type: String
    },
    dspecialty: {
        type: String
    },
    cancertype: {
        type: String
    },
    date: {
        type: String, // Change the type to String
        set: function (value) {
            if (value instanceof Date) {
                return value.toISOString().split('T')[0]; // Format the date as "YYYY-MM-DD"
            }
            return value;
        }
    },
    time:{
        type: String
    },
    joined: { type: Date, default: Date.now }
 },{
 collection: 'clinicSchedule'
 });

 module.exports = mongoose.model('ClinicSchedule', ClinicSchedule);