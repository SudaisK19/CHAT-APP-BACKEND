// models/userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'please provide a name'] },
  email:    { type: String, required: [true, 'please provide an email'] },
  password: { type: String, required: [true, 'please provide a password'] },
  role:     { type: String, enum: ['admin','customer'], default: 'customer' },
  address:  { type: String, default: '' },
  phone:    { type: String, default: '' },
}, {
  timestamps: true,
  collection: 'users'   // ← must match your ecommerce DB’s users collection
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
