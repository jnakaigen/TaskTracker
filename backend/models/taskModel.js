const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    dueDate: { 
        type: Date, 
        required: [true, 'Due date is required'],
        validate: {
            validator: function(value) {
                return value > new Date(); // Ensures due date is in the future
            },
            message: 'Due date must be in the future'
        }
    },
    assignedTo: { 
        type: String, // Better to reference User model
        ref: 'User', // Reference to User model
        required: [true, 'Assigned user is required']
    },
    project: { 
        type: String, // Better to reference Project model
        ref: 'Project', // Reference to Project model
        required: [true, 'Project is required']
    },
    status: { 
        type: String, 
        required: true,
        enum: {
            values: ['To Do', 'In Progress', 'Done'],
            message: 'Status must be either "To Do", "In Progress", or "Done"'
        },
        default: 'To Do' // Default value
    },

}, { 
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals when document is converted to JSON
    toObject: { virtuals: true } // Include virtuals when document is converted to object
});

// Add index for frequently queried fields
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);