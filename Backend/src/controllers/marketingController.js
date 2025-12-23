import MarketingRequest from '../models/MarketingRequest.js';
import { generateCompleteAsset, testHuggingFaceAPI } from '../services/aiService.js';

/**
 * Test Hugging Face API
 * GET /api/test-hf
 */
export const testHuggingFace = async (req, res) => {
  try {
    console.log('\n🧪 Running Hugging Face API diagnostic test...');
    const diagnostics = await testHuggingFaceAPI();
    
    res.status(diagnostics.success ? 200 : 500).json({
      success: diagnostics.success,
      message: diagnostics.success 
        ? 'Hugging Face API is working correctly!' 
        : 'Hugging Face API test failed',
      diagnostics: diagnostics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing Hugging Face API',
      error: error.message
    });
  }
};

/**
 * Generate marketing asset
 * POST /api/generate
 */
export const generateMarketingAsset = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { productName, category, brandTone, platform } = req.body;

    // Validation
    if (!productName || !category || !brandTone || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: productName, category, brandTone, platform'
      });
    }

    // Create initial database record
    const marketingRequest = new MarketingRequest({
      productName,
      category,
      brandTone,
      platform,
      status: 'pending'
    });

    await marketingRequest.save();

    console.log(`🚀 Processing request ${marketingRequest.requestId} for ${productName}`);

    // Generate AI content
    const aiOutput = await generateCompleteAsset({
      productName,
      category,
      brandTone,
      platform
    });

    // Update record with results
    marketingRequest.aiOutput = aiOutput;
    marketingRequest.status = 'completed';
    marketingRequest.processingTime = Date.now() - startTime;
    await marketingRequest.save();

    console.log(`✅ Request ${marketingRequest.requestId} completed in ${marketingRequest.processingTime}ms`);
    console.log(`📸 Image URL returned: ${aiOutput.imageUrl.substring(0, 50)}...`);
    console.log(`🎨 Image Source: ${aiOutput.imageSource || 'Unknown'}`);

    // FIXED: Validate image URL for both base64 and HTTP URLs
    const isValidImage = aiOutput.imageUrl && (
      aiOutput.imageUrl.startsWith('data:image/') || 
      aiOutput.imageUrl.startsWith('http')
    );
    
    if (!isValidImage) {
      console.warn('⚠️  Invalid or missing image URL in response');
    }

    // Send response
    res.status(200).json({
      success: true,
      message: 'Marketing asset generated successfully',
      data: {
        requestId: marketingRequest.requestId,
        productName: marketingRequest.productName,
        category: marketingRequest.category,
        brandTone: marketingRequest.brandTone,
        platform: marketingRequest.platform,
        result: {
          caption: aiOutput.caption,
          hashtags: aiOutput.hashtags,
          callToAction: aiOutput.callToAction,
          imageUrl: aiOutput.imageUrl,
          imageSource: aiOutput.imageSource
        },
        processingTime: marketingRequest.processingTime,
        timestamp: marketingRequest.createdAt
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('❌ Error generating marketing asset:', error);

    // Try to update database record with error
    try {
      const requestId = req.body.requestId;
      if (requestId) {
        await MarketingRequest.findOneAndUpdate(
          { requestId },
          {
            status: 'failed',
            errorMessage: error.message,
            processingTime
          }
        );
      }
    } catch (dbError) {
      console.error('Failed to update error in database:', dbError);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate marketing asset',
      error: error.message
    });
  }
};

/**
 * Get all marketing requests (with pagination)
 * GET /api/history
 */
export const getMarketingHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await MarketingRequest.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await MarketingRequest.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRequests: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketing history',
      error: error.message
    });
  }
};

/**
 * Get single marketing request by ID
 * GET /api/request/:requestId
 */
export const getMarketingRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await MarketingRequest.findOne({ requestId }).select('-__v');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Marketing request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });

  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketing request',
      error: error.message
    });
  }
};

/**
 * Health check endpoint
 * GET /api/health
 */
export const healthCheck = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'AI Marketing API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed'
    });
  }
};

export default {
  generateMarketingAsset,
  getMarketingHistory,
  getMarketingRequest,
  healthCheck
};