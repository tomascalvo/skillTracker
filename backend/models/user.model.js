const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  title: {
    type: String,
    // required: true,
    default: "learner", 
    min: 2,
    max: 255
  },
}, 
{
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);