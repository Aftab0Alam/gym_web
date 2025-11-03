// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');

// /api/dashboard/stats पर डैशबोर्ड आँकड़े प्राप्त करना
router.get('/stats', async (req, res) => {
    try {
        // 1. सदस्य आँकड़े
        const totalMembers = await Member.countDocuments({});
        const activeMembers = await Member.countDocuments({ membershipStatus: 'Active' });
        const expiredMembers = await Member.countDocuments({ membershipStatus: 'Expired' });
        const dueMembers = await Member.countDocuments({ membershipStatus: 'Due' });

        // 2. आगामी नवीनीकरण अलर्ट (अगले 7 दिनों के लिए)
        const nextSevenDays = new Date();
        nextSevenDays.setDate(nextSevenDays.getDate() + 7);

        const upcomingRenewals = await Member.find({
            renewalDate: { $lte: nextSevenDays, $gte: new Date() },
            membershipStatus: { $ne: 'Expired' } // समाप्त सदस्यों को शामिल न करें
        }).select('name memberId renewalDate contact');

        // 3. मासिक आय अवलोकन (चालू माह)
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        // 🔹 Step 1: Payment Collection से Total Income
        const monthlyIncomeResult = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: currentMonthStart, $lte: currentMonthEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    totalMonthlyIncome: { $sum: '$amount' }
                }
            }
        ]);

        let totalMonthlyIncome = monthlyIncomeResult.length > 0
            ? monthlyIncomeResult[0].totalMonthlyIncome
            : 0;

        // 🔹 Step 2: New Members की Joining Fee जोड़ें
        const newMembers = await Member.find({
            createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
        });

        // अगर तुम्हारे schema में `joiningFee` नहीं है तो default ₹500 मान लेते हैं
        const joiningIncome = newMembers.reduce(
            (sum, m) => sum + (m.joiningFee || 500),
            0
        );

        // 🔹 Step 3: दोनों income जोड़ो
        totalMonthlyIncome += joiningIncome;

        // 4. दैनिक उपस्थिति (आज के लिए)
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));

        const dailyAttendanceCount = await Attendance.countDocuments({
            checkInTime: { $gte: todayStart, $lte: todayEnd }
        });

        res.status(200).json({
            memberStats: {
                totalMembers,
                activeMembers,
                expiredMembers,
                dueMembers
            },
            financialStats: {
                totalMonthlyIncome,
                joiningIncome, // यह extra detail भी भेज दो, काम आ सकती है
            },
            attendanceStats: {
                dailyAttendanceCount
            },
            alerts: {
                upcomingRenewals
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard statistics' });
    }
});

module.exports = router;
