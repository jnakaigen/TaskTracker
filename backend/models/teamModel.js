const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true, default: 'Member' }, // always 'Member'
    project_role: { type: String, required: true }, // new field, visible to user
    adminId: { type: String, required: true },
    // img: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);