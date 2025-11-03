// models/Member.js

const mongoose = require('mongoose');

// सदस्य प्रबंधन मॉड्यूल के लिए स्कीमा
const MemberSchema = new mongoose.Schema({
    // एडमिन द्वारा भरे गए मूल विवरण 
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    contact: {
        type: String,
        required: true,
        unique: true // फोन नंबर से सदस्य को खोजा जा सकता है 
    },
    
    // योजना और भुगतान विवरण 
    planType: {
        type: String,
        required: true,
    },
    cashAmountPaid: {
        type: Number,
        required: true,
    },
    
    // सिस्टम द्वारा स्वचालित रूप से उत्पन्न विवरण [cite: 10]
    memberId: {
        type: String,
        required: true,
        unique: true
    },
    qrCodeData: {
        type: String, // QR कोड स्ट्रिंग को यहाँ स्टोर किया जाएगा [cite: 10]
        required: true
    },
    
    // सदस्यता स्थिति (Status)
    membershipStatus: {
        type: String,
        enum: ['Active', 'Expired', 'Due'], // सक्रिय सदस्यता सत्यापित की जाएगी [cite: 14]
        default: 'Active'
    },
    renewalDate: {
        type: Date, // नवीनीकरण रिमाइंडर के लिए आवश्यक [cite: 19]
        required: true
    }
}, {
    timestamps: true // कब बनाया और अपडेट किया गया, यह ट्रैक करने के लिए
});

module.exports = mongoose.model('Member', MemberSchema);