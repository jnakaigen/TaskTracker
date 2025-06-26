const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Custom user-provided ID
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: { 
    type: String, 
    required: true,
    enum: ['Admin', 'Member']
  },
  name: { 
    type: String, 
    required: true
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
