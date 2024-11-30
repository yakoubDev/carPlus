import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name.']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true
  },
  image: {
    type: String,
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: '' // e.g., 'mechanic' or 'assistant'
  },
  location: {
    type: {
      type: String, // Must be 'Point' for GeoJSON
      enum: ['Point'], // Restrict to 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // Array of [longitude, latitude]
      required: true,
    },
  },
});

// Create a geospatial index
userSchema.index({ location: '2dsphere' });

const User = models.User || model('User', userSchema);

export default User;
