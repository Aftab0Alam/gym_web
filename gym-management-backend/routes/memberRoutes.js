// ✅ आवश्यक पैकेज आयात करना
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const QRCode = require('qrcode');
const { sendWelcomeAlert } = require('../services/whatsappService');

// ---------------------------------------------
// 🧩 POST: नया सदस्य पंजीकृत करें (/api/members/register)
// ---------------------------------------------
router.post('/register', async (req, res) => {
  const { name, age, gender, contact, planType, cashAmount } = req.body;

  try {
    // 1️⃣ यूनिक मेंबर ID बनाना
    const memberId = 'GM-' + Date.now().toString().slice(-6);

    // 2️⃣ QR कोड जनरेट करना
    const qrCodeData = await QRCode.toDataURL(memberId);

    // 3️⃣ रिन्युअल डेट सेट करना (1 महीना आगे)
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    // 4️⃣ नया मेंबर सेव करना
    const newMember = new Member({
      name,
      age,
      gender,
      contact,
      planType,
      cashAmountPaid: cashAmount,
      memberId,
      qrCodeData,
      renewalDate,
    });

    await newMember.save();

    // 5️⃣ WhatsApp स्वागत संदेश भेजना (simulation)
    sendWelcomeAlert(contact, name, memberId);

    res.status(201).json({
      message: 'Member registered successfully!',
      member: newMember,
      qrCodeImage: qrCodeData,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ---------------------------------------------
// 🧾 GET: सभी मेंबर प्राप्त करें
// ---------------------------------------------
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Failed to fetch members' });
  }
});

// ---------------------------------------------
// ✏️ PUT: मेंबर अपडेट करें
// ---------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMember) return res.status(404).json({ message: 'Member not found' });

    res.status(200).json({ message: 'Member updated successfully', updatedMember });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Failed to update member' });
  }
});

// ---------------------------------------------
// ❌ DELETE: मेंबर डिलीट करें
// ---------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ message: 'Member not found' });

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Failed to delete member' });
  }
});

// ---------------------------------------------
// 🆕 GET: इस महीने में जुड़े नए मेंबर (for PDF report)
// ---------------------------------------------
router.get('/new/:monthStart', async (req, res) => {
  try {
    const monthStart = new Date(req.params.monthStart);
    const nextMonth = new Date(monthStart);
    nextMonth.setMonth(monthStart.getMonth() + 1);

    const newMembers = await Member.find({
      createdAt: { $gte: monthStart, $lt: nextMonth },
    })
      .select('name memberId createdAt planType contact cashAmountPaid')
      .sort({ createdAt: -1 });

    res.status(200).json(newMembers);
  } catch (error) {
    console.error('Error fetching new members:', error);
    res.status(500).json({ message: 'Server error fetching new members' });
  }
});

module.exports = router;
