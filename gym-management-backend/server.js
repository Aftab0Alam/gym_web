// आवश्यक पैकेज आयात करना
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // CORS आयात करें

// .env फ़ाइल से पर्यावरण चर लोड करना
dotenv.config();

// एक्सप्रेस ऐप शुरू करना
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ----------------------------------------------------
// 0. मिडलवेयर (Middleware) और CORS
// ----------------------------------------------------
// JSON डेटा को पार्स करने के लिए
app.use(express.json());

// CORS मिडलवेयर जोड़ें (फ्रंटएंड को डेटा एक्सेस करने की अनुमति देने के लिए)
app.use(cors({
    origin: 'http://localhost:5173', // Vite का डिफ़ॉल्ट पोर्ट
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// ----------------------------------------------------
// 1. डेटाबेस कनेक्शन
// ----------------------------------------------------
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB successfully connected!');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        // विफलता पर प्रक्रिया को बाहर निकालें
        process.exit(1); 
    }
};

// डेटाबेस से कनेक्ट करें
connectDB();

// ----------------------------------------------------
// 2. मूल रूट (Basic Root)
// ----------------------------------------------------
app.get('/', (req, res) => {
    res.send('🏋️ Gym Management System Backend is Running...');
});

// ----------------------------------------------------
// 3. आवश्यक रूट्स को इंपोर्ट करना
// ----------------------------------------------------
const memberRoutes = require('./routes/memberRoutes'); 
const attendanceRoutes = require('./routes/attendanceRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes'); // ✅ नया रिपोर्ट रूट
const authRoutes = require('./routes/authRoutes');
// ----------------------------------------------------
// 4. API रूटिंग (Routes) को जोड़ना - सभी मॉड्यूल को जोड़ें!
// ----------------------------------------------------
app.use('/api/members', memberRoutes);
app.use('/api/attendance', attendanceRoutes); // उपस्थिति रूट
app.use('/api/payments', paymentRoutes);     // भुगतान रूट
app.use('/api/dashboard', dashboardRoutes);   // डैशबोर्ड/एनालिटिक्स रूट
app.use('/api/reports', reportRoutes);        // ✅ मासिक रिपोर्ट रूट
app.use('/api/auth', authRoutes); // add this

// ----------------------------------------------------
// 5. सर्वर शुरू करना
// ----------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Access it at http://localhost:${PORT}`);
});
