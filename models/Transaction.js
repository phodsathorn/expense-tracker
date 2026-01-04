const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: [true, 'กรุณาใส่ชื่อรายการ']
    },
    amount: {
        type: Number,
        required: [true, 'กรุณาใส่จำนวนเงิน']
    },
    type: {
        type: String, // 'income' หรือ 'expense'
        required: true
    },
    // --- ส่วนที่เพิ่มมาใหม่ ---
    category: {
        type: String,
        required: [true, 'กรุณาเลือกหมวดหมู่']
    },
    date: {
        type: Date,
        default: Date.now // ถ้าไม่กรอก จะใช้วันปัจจุบัน
    },
    // ----------------------
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);