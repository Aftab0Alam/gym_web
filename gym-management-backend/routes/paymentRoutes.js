const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Payment = require('../models/Payment');
const { sendRenewalAlert } = require('../services/whatsappService');

// 🔹 Helper function — safe month addition
function addMonthsSafe(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + parseInt(months));

  // अगर overflow हुआ (जैसे 31 Jan → 3 Mar), तो पिछले महीने का आखिरी दिन लो
  if (d.getDate() < day) {
    d.setDate(0);
  }

  return d;
}

// 🟢 Record new payment
router.post('/record', async (req, res) => {
  const { memberId, amount, durationInMonths } = req.body;

  if (!memberId || !amount || !durationInMonths) {
    return res.status(400).json({ message: 'Member ID, amount, and duration are required.' });
  }

  try {
    const member = await Member.findOne({ memberId });

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    // नया भुगतान रिकॉर्ड बनाएँ
    const newPayment = new Payment({
      memberId,
      amount,
      durationInMonths,
    });

    await newPayment.save();

    // 🔹 Renewal date logic — safe & accurate
    const now = new Date();
    const baseDate =
      member.renewalDate && new Date(member.renewalDate) > now
        ? new Date(member.renewalDate)
        : now;

    const newRenewalDate = addMonthsSafe(baseDate, durationInMonths);

    member.renewalDate = newRenewalDate;
    member.membershipStatus = 'Active';
    await member.save();

    // WhatsApp रिमाइंडर भेजें
    sendRenewalAlert(member.contact, member.name, newRenewalDate);

    res.status(201).json({
      message: 'Payment recorded and membership renewed successfully!',
      newRenewalDate: newRenewalDate.toDateString(),
      paymentRecord: newPayment,
    });
  } catch (error) {
    console.error('Payment recording error:', error);
    res.status(500).json({ message: 'Server error during payment processing' });
  }
});

// 🟡 Get payment history
router.get('/history/:memberId', async (req, res) => {
  try {
    const payments = await Payment.find({ memberId: req.params.memberId }).sort({ paymentDate: -1 });

    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payment history found for this member.' });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error('Fetching payment history error:', error);
    res.status(500).json({ message: 'Server error fetching payment history' });
  }
});

module.exports = router;
