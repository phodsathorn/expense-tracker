require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// เรียกใช้ Model ที่เราเพิ่งสร้าง
const Transaction = require('./models/Transaction');

const app = express();

// --- Middleware ---
app.use(express.json()); // สำคัญ! ช่วยให้อ่าน JSON ได้
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// --- Connect Database ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB!'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- API Routes ---

// 1. เช็คว่า Server อยู่ไหม
app.get('/', (req, res) => {
    res.send('Hello World! Server is ready.');
});

// 2. API สร้างรายการใหม่ (Create)
app.post('/api/transactions', async (req, res) => {
    try {
        // รับข้อมูลจาก Frontend (req.body) แล้วบันทึกลง Database
        const transaction = await Transaction.create(req.body);
        
        // ถ้าสำเร็จ ส่งข้อมูลกลับไปบอก
        res.status(201).json({
            success: true,
            data: transaction
        });
        console.log("📝 บันทึกข้อมูลสำเร็จ:", transaction); // โชว์ใน Terminal ด้วย
    } catch (err) {
        // ถ้าพัง (เช่น ลืมใส่ราคา) ส่ง Error กลับไป
        res.status(400).json({
            success: false,
            error: err.message
        });
        console.log("❌ บันทึกไม่สำเร็จ:", err.message);
    }
});

// 3. API ดึงข้อมูลทั้งหมด (GET)
app.get('/api/transactions', async (req, res) => {
    try {
        // ไปค้นหาข้อมูลทั้งหมดใน Database แล้วเรียงเอาของใหม่ขึ้นก่อน
        const transactions = await Transaction.find().sort({ date: -1 });

        // ส่งกลับไปบอก User
        res.status(200).json({
            success: true,
            count: transactions.length, // บอกด้วยว่าเจอมีกี่รายการ
            data: transactions
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});