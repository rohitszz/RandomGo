const mongoose = require('mongoose');
const User = require('./user'); 

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        ref: 'User',
        required: true,
    },
    recieverId: {
        type: String,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
    }, 
    image: {
          type: String,
          default: null,
    },
    seen: {
        type: Boolean,
        default: false
    },
    createdAt: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true });

module.exports = mongoose.model('message', messageSchema);
