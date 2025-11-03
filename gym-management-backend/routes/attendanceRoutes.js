// routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Attendance = require('../models/Attendance');
const { sendExpiredAlert } = require('../services/whatsappService');

// ✅ POST: /api/attendance/scan (QR के माध्यम से उपस्थिति दर्ज करना)
router.post('/scan', async (req, res) => {
  const { memberId } = req.body;

  if (!memberId) {
    return res.status(400).json({ message: 'QR Code (memberId) is required for attendance.' });
  }

  try {
    const member = await Member.findOne({ memberId });

    if (!member) {
      return res.status(404).json({ message: 'Member not found. Please register.' });
    }

    const currentDate = new Date();
    const renewalDate = new Date(member.renewalDate);

    if (renewalDate < currentDate) {
      // सदस्यता समाप्त हो चुकी है
      member.membershipStatus = 'Expired';
      await member.save();

      // WhatsApp reminder भेजें
      sendExpiredAlert(member.contact, member.name, renewalDate);

      return res.status(403).json({
        message: `Alert: Hi ${member.name}, your gym plan expired on ${renewalDate.toDateString()}. Please renew soon!`,
        status: 'expired'
      });
    }

    // ✅ उपस्थिति दर्ज करें (यदि सदस्यता सक्रिय है)
    const attendanceRecord = new Attendance({
      memberId: member.memberId,
      checkInTime: currentDate
    });

    await attendanceRecord.save();

    res.status(200).json({
      message: `Attendance marked successfully for ${member.name}!`,
      member: { name: member.name, status: member.membershipStatus }
    });

  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({ message: 'Server error during attendance tracking' });
  }
});

// ✅ GET: /api/attendance/history (पिछले 10 दिनों की उपस्थिति दिखाना)
router.get('/history', async (req, res) => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Attendance records fetch करें
    const history = await Attendance.find({
      checkInTime: { $gte: tenDaysAgo }
    }).sort({ checkInTime: -1 });

    // Member details manually जोड़ें (populate की जगह)
    const formattedHistory = [];

    for (const record of history) {
      const member = await Member.findOne({ memberId: record.memberId });
      formattedHistory.push({
        memberId: record.memberId,
        memberName: member ? member.name : "Unknown Member",
        checkInTime: record.checkInTime
      });
    }

    if (formattedHistory.length === 0) {
      return res.status(200).json({
        message: 'No attendance records found in the last 10 days.',
        history: []
      });
    }

    // ✅ फ्रंटएंड को साफ़ डेटा भेजो
    res.status(200).json(formattedHistory);

  } catch (error) {
    console.error('Attendance History error:', error);
    res.status(500).json({
      message: 'Server error fetching attendance history',
      error: error.message
    });
  }
});

module.exports = router;
