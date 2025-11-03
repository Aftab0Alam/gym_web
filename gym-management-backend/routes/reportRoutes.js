const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Member = require("../models/Member");

// Monthly Report Route
router.get("/monthly-report", async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 🔹 Payments for the current month
    const payments = await Payment.find({
      date: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    // 🔹 New Members joined this month
    const newMembers = await Member.find({
      joiningDate: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    // 🔹 Total Income = Payments + New Members joining fees
    const totalPaymentIncome = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalMemberIncome = newMembers.reduce((sum, m) => sum + (m.fees || 0), 0);
    const totalIncome = totalPaymentIncome + totalMemberIncome;

    res.json({
      month: now.toLocaleString("default", { month: "long", year: "numeric" }),
      totalIncome,
      payments,
      newMembers,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
});

module.exports = router;
