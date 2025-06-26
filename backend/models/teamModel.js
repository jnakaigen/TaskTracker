// Step 1: Define a team schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    // img: { type: String } // Uncomment if you want to store avatar URLs
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Step 2: Create a team model
module.exports = mongoose.model('Team', teamSchema);