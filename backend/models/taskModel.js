//step 1:define a task schema
const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },  // Note: consistent camelCase (dueDate, not duedate)
    status: { 
        type: String, 
        required: true,
        enum: ['pending', 'in-progress', 'completed'] // Recommended: add allowed values
    },
    priority: { 
        type: String, 
        required: true,
        enum: ['low', 'medium', 'high'] // Recommended: add allowed values
    }
}, { timestamps: true }); // Timestamps are automatically added by Mongoose if timestamps is set to true in the schema options.  This adds createdAt and updatedAt fields to the schema.
//step 2: create a task model

module.exports=mongoose.model('Task', taskSchema)