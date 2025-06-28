const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    adminId: { type: String, required: true }, // <-- Add this line
    // img: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);