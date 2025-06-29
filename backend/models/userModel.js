const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Custom user-provided ID
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
   name: { 
    type: String, 
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true  // Trim leading and trailing whitespace
  },
  role: { 
    type: String, 
    required: true,
    enum: ['Admin', 'Member']
  },
   project_role: { // <-- Add this field
    type: String,
    required: function() { return this.role === 'Member'; }, // required for members
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: false,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    }
  }
});

// Note: removed virtual id since user provides custom `id` field

module.exports = mongoose.model('User', userSchema);
