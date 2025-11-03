const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    // किस सदस्य ने स्कैन किया
    memberId: {
        type: String,
        required: true,
        ref: 'Member' // Member मॉडल से लिंक
    },
    // उपस्थिति का समय (2 मिनट बाद अपने आप delete)
    checkInTime: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 30  // 60*2⏱️ 2 minutes for testing (auto delete after 2 min)
    }
}, {
    timestamps: true // कब बनाया और अपडेट किया गया, यह ट्रैक करने के लिए
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
