// models/Payment.js

const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: true,
        ref: 'Member' 
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    durationInMonths: {
        type: Number, 
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash'], 
        default: 'Cash'
    },
}, {
    timestamps: true 
});

module.exports = mongoose.model('Payment', PaymentSchema);