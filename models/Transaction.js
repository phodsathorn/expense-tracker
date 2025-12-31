const mongoose = require('mongoose');

// สร้าง Schema (โครงสร้างข้อมูล)
const TransactionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'กรุณาระบุชื่อรายการ']
    },
    amount: {
        type: Number,
        required: [true, 'กรุณาระบุจำนวนเงิน']
    },
    type: {
        type: String,
        // enum: ['income', 'expense'], // (ไว้ค่อยเปิดใช้ตอนทำ Frontend เสร็จ)
        required: true
    },
    date: {
        type: Date,
        default: Date.now // ถ้าไม่ระบุวันที่ ให้ใช้วันปัจจุบันอัตโนมัติ
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);