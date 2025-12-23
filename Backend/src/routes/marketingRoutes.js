import express from 'express';
import {
  generateMarketingAsset,
  getMarketingHistory,
  getMarketingRequest,
  healthCheck,
  testHuggingFace
} from '../controllers/marketingController.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// Test Hugging Face API connectivity
router.get('/test-hf', testHuggingFace);

// Generate marketing asset
router.post('/generate', generateMarketingAsset);

// Get marketing history
router.get('/history', getMarketingHistory);

// Get single marketing request
router.get('/request/:requestId', getMarketingRequest);

export default router;
