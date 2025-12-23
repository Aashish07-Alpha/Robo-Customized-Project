import mongoose from 'mongoose';

const marketingRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
    default: () => `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  // User Input
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['t-shirt', 'hoodie', 'shoes', 'jacket', 'dress', 'pants', 'accessories', 'other'],
    trim: true
  },
  brandTone: {
    type: String,
    required: true,
    enum: ['luxury', 'casual', 'streetwear', 'minimal', 'vintage', 'sporty'],
    trim: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Instagram', 'WhatsApp', 'Website', 'Facebook', 'Twitter'],
    trim: true
  },
  // AI Generated Output
  aiOutput: {
    caption: {
      type: String,
      default: ''
    },
    hashtags: {
      type: [String],
      default: []
    },
    callToAction: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  // Metadata
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  errorMessage: {
    type: String,
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
marketingRequestSchema.index({ requestId: 1 });
marketingRequestSchema.index({ createdAt: -1 });

const MarketingRequest = mongoose.model('MarketingRequest', marketingRequestSchema);

export default MarketingRequest;
