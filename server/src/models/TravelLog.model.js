import mongoose from 'mongoose';

const travelLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    visitedDate: {
      type: Date,
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    images: [
      {
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },    
  },
  {
    timestamps: true,
  }
);

const TravelLog = mongoose.model('TravelLog', travelLogSchema);

export default TravelLog;
