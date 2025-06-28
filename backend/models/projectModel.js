const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    pid: { 
        type: String, 
        required: true ,
        unique: true 
    },
    id:{ 
        type: String,
        required: true, 
        ref: 'User'  // Now 'id' references the User model
    },
    title: { 
        type: String, 
        required: true 
    },
    description: {   // Added description field
        type: String, 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    dueDate: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);