// utils/dateUtils.js

exports.addMonthsSafe = (date, months) => {
  const d = new Date(date);
  const day = d.getDate();

  // नया महीना और साल निकालो
  d.setMonth(d.getMonth() + parseInt(months));

  // अगर date overflow हो गया (जैसे 31 Jan → 3 Mar)
  if (d.getDate() < day) {
    d.setDate(0); // पिछले महीने का आखिरी दिन सेट कर दो
  }

  return d;
};
