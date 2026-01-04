require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// เรียกใช้ Model
const Transaction = require('./models/Transaction');

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// --- Connect Database ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB!'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- API Routes ---

// 1. API ดึงข้อมูล (GET) - รองรับทั้ง "ดูทั้งหมด" และ "Filter เดือน/ปี" ในตัวเดียว
app.get('/api/transactions', async (req, res) => {
    try {
        const { month, year } = req.query;
        let query = {};

        // ถ้ามีการส่งเดือนและปีมา ให้เพิ่มเงื่อนไขกรองวันที่
        if (month && year) {
            const startDate = new Date(year, month - 1, 1); // วันแรกของเดือน
            const endDate = new Date(year, month, 0, 23, 59, 59); // วันสุดท้ายของเดือน
            
            query.date = {
                $gte: startDate, 
                $lte: endDate    
            };
        }

        // ถ้าไม่มี month/year ส่งมา query จะเป็น {} ซึ่งแปลว่า "หาทั้งหมด"
        const transactions = await Transaction.find(query).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// 2. API สร้างรายการใหม่ (Create)
app.post('/api/transactions', async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        
        res.status(201).json({
            success: true,
            data: transaction
        });
        console.log("📝 บันทึกข้อมูลสำเร็จ:", transaction);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
        console.log("❌ บันทึกไม่สำเร็จ:", err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});