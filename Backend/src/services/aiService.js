import OpenAI from 'openai';
import axios from 'axios';

// Lazy initialization of OpenAI client to ensure env vars are loaded
let openai = null;
const getOpenAIClient = () => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.');
    }
    
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openai;
};

/**
 * Fetch real product image from Pexels API
 * @param {Object} params - Product details
 * @returns {String} - Image URL from Pexels
 */
/**
 * Generate fallback placeholder image
 * @param {Object} params - Product details
 * @returns {String} - Placeholder image URL
 */
function generateFallbackImage({ productName, category }) {
  // Professional placeholder that shows product information
  const encodedProduct = encodeURIComponent(productName);
  const encodedCategory = encodeURIComponent(category);
  return `https://placehold.co/1024x1024/6366f1/ffffff?text=${encodedProduct}%0A${encodedCategory}&font=raleway`;
}

// Mock data generators for demo/testing without OpenAI API
function generateMockMarketingCopy({ productName, category, brandTone, platform }) {
  // Dynamic captions based on product type and tone
  const captionTemplates = {
    luxury: [
      `Experience pure elegance with the ${productName}. Crafted for those who demand nothing but the finest. Elevate your ${category.toLowerCase()} collection today. ✨`,
      `The ${productName} redefines sophistication. Exclusive design meets timeless luxury in this exceptional ${category.toLowerCase()} piece. 💎`,
      `Indulge in the ${productName} - where premium craftsmanship meets refined taste. Your wardrobe deserves this masterpiece. 🌟`
    ],
    casual: [
      `Meet the ${productName} - your new go-to for everyday comfort and style. Perfect for relaxed vibes and effortless looks. 😊`,
      `The ${productName} brings comfort to the next level. Easy to wear, easy to love. Your ${category.toLowerCase()} essential awaits! 👕`,
      `Kick back in style with the ${productName}. Casual never looked this good! Perfect for any laid-back occasion. ☀️`
    ],
    streetwear: [
      `The ${productName} hits different! Bold design meets street culture in this must-have ${category.toLowerCase()}. Own the streets. 🔥`,
      `Level up your street style with the ${productName}. This ${category.toLowerCase()} screams attitude and authenticity. 💯`,
      `The ${productName} is pure fire! Urban edge meets fresh design in this iconic ${category.toLowerCase()} piece. Stay lit! ⚡`
    ],
    minimal: [
      `Clean. Simple. Perfect. The ${productName} embodies minimalist design at its finest. Less is more. 🤍`,
      `The ${productName} - timeless simplicity for the modern wardrobe. Effortlessly elegant ${category.toLowerCase()}. ⚪`,
      `Pure design. Zero noise. The ${productName} brings minimalist perfection to your ${category.toLowerCase()} collection. ✦`
    ],
    vintage: [
      `Step back in time with the ${productName}. Classic charm meets nostalgic style in this retro ${category.toLowerCase()}. 🕰️`,
      `The ${productName} brings vintage vibes to modern fashion. Timeless design that never goes out of style. 📻`,
      `Embrace the golden era with the ${productName}. This ${category.toLowerCase()} is a throwback to authentic style. 🎞️`
    ],
    sporty: [
      `Power your performance with the ${productName}. Athletic design meets dynamic style in this ${category.toLowerCase()}. 💪`,
      `The ${productName} keeps you moving in style. Built for action, designed for champions. Get yours now! 🏃`,
      `Unleash your energy with the ${productName}. This ${category.toLowerCase()} brings the heat to your active lifestyle. 🔋`
    ]
  };

  const ctaTemplates = {
    luxury: [
      `Invest in excellence - Shop the ${productName} collection now! 💎`,
      `Experience luxury - Add ${productName} to your collection today! 🛍️`,
      `Elevate your style - Get the ${productName} before it's gone! ✨`
    ],
    casual: [
      `Shop the ${productName} now - comfort awaits! 🛒`,
      `Grab your ${productName} today and relax in style! 😊`,
      `Don't miss out - Get the ${productName} while it lasts! 👉`
    ],
    streetwear: [
      `Cop the ${productName} now! Limited drop! 🔥`,
      `Don't sleep on the ${productName} - grab it now! 💯`,
      `Get the ${productName} before it sells out! Move fast! ⚡`
    ],
    minimal: [
      `Shop the ${productName} - simplicity perfected. 🤍`,
      `Add the ${productName} to cart - clean design awaits. ✦`,
      `Get your ${productName} now - timeless style. ⚪`
    ],
    vintage: [
      `Shop the ${productName} - classic never fades! 🕰️`,
      `Grab the ${productName} - retro style is back! 📻`,
      `Get your ${productName} now - nostalgia awaits! 🎞️`
    ],
    sporty: [
      `Get the ${productName} - fuel your performance! 💪`,
      `Shop the ${productName} now - stay active in style! 🏃`,
      `Grab your ${productName} - champions choose quality! 🔋`
    ]
  };

  const platformHashtags = {
    Instagram: ['#InstaFashion', '#OOTD', '#StyleInspo', '#FashionGram', '#InstaStyle'],
    Facebook: ['#FashionLovers', '#ShopNow', '#NewArrivals', '#Trending', '#StyleDaily'],
    Twitter: ['#Fashion', '#Style', '#Shopping', '#MustHave', '#FashionTrends'],
    LinkedIn: ['#ProfessionalStyle', '#BusinessFashion', '#WorkWear', '#CareerFashion', '#BusinessAttire'],
    TikTok: ['#FashionTok', '#StyleTok', '#OOTD', '#TikTokFashion', '#TikTokStyle']
  };

  // Get random template for variety
  const captionList = captionTemplates[brandTone] || captionTemplates.casual;
  const ctaList = ctaTemplates[brandTone] || ctaTemplates.casual;
  const randomIndex = Math.floor(Math.random() * captionList.length);
  
  const caption = captionList[randomIndex];
  const callToAction = ctaList[randomIndex];
  
  // Generate unique hashtags
  const productHash = `#${productName.replace(/\s+/g, '')}`;
  const categoryHash = `#${category.replace(/\s+/g, '')}`;
  const baseHashtags = platformHashtags[platform] || platformHashtags.Instagram;
  
  // Shuffle and pick 3 random platform hashtags for variety
  const shuffled = [...baseHashtags].sort(() => 0.5 - Math.random());
  const hashtags = [categoryHash, productHash, ...shuffled.slice(0, 3)];

  return { caption, hashtags, callToAction };
}



/**
 * Generate marketing copy using OpenAI GPT-4o-mini
 * @param {Object} params - Product details
 * @returns {Object} - Generated marketing content
 */
export const generateMarketingCopy = async ({ productName, category, brandTone, platform }) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Check if API key exists and appears valid
    if (!apiKey || apiKey.length < 40 || apiKey.includes('*')) {
      console.log('⚠️  Invalid or missing OpenAI API key. Using MOCK DATA.');
      return generateMockMarketingCopy({ productName, category, brandTone, platform });
    }

    console.log(`🤖 Generating AI marketing copy for: ${productName} (${brandTone} tone, ${platform})`);

    const openai = getOpenAIClient();
    
    const prompt = `You are a professional fashion marketing expert. 

Generate a **marketing caption**, **call-to-action**, and **hashtags** for a product.

Product Name: ${productName}
Category: ${category}
Brand Tone: ${brandTone}
Platform: ${platform}

Requirements:
- Caption: Engaging, concise, fits platform style (2-3 sentences max, platform-appropriate)
- Call-to-Action: Encourage users to buy or check product (action-oriented)
- Hashtags: Exactly 5 relevant hashtags related to product, category, fashion, and platform

Return **strictly in JSON**:
{
  "caption": "",
  "callToAction": "",
  "hashtags": []
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert fashion marketing copywriter specializing in e-commerce and social media marketing. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    const parsedContent = JSON.parse(content);

    console.log('✅ AI marketing copy generated successfully');

    return {
      caption: parsedContent.caption || '',
      hashtags: (parsedContent.hashtags || []).slice(0, 5),
      callToAction: parsedContent.callToAction || ''
    };

  } catch (error) {
    console.error('❌ Error generating marketing copy:', error.message);
    
    // Fallback to mock data on any error
    if (error.status === 401 || error.code === 'invalid_api_key' || error.message.includes('API key')) {
      console.log('⚠️  OpenAI authentication failed. Using MOCK DATA.');
    } else {
      console.log('⚠️  OpenAI API error. Using MOCK DATA as fallback.');
    }
    
    return generateMockMarketingCopy({ productName, category, brandTone, platform });
  }
};

/**
 * Test Stability AI API connectivity and key validation
 * @returns {Object} - API status and diagnostics
 */
export const testHuggingFaceAPI = async () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    apiKeyStatus: 'unknown',
    apiKeyLength: 0,
    apiKeyPrefix: '',
    envFileLoaded: false,
    apiResponse: null,
    error: null,
    success: false
  };

  try {
    const apiKey = process.env.STABILITY_API_KEY;
    console.log('\n🔍 DIAGNOSTIC TEST: Stability AI API');
    console.log('=' .repeat(50));
    
    if (!apiKey || apiKey.length < 10) {
      diagnostics.apiKeyStatus = 'MISSING';
      diagnostics.error = 'STABILITY_API_KEY not found or invalid';
      console.log('❌ API Key: NOT FOUND or INVALID');
      return diagnostics;
    }

    diagnostics.envFileLoaded = true;
    diagnostics.apiKeyLength = apiKey.length;
    diagnostics.apiKeyPrefix = apiKey.substring(0, 7) + '***';
    diagnostics.apiKeyStatus = 'FOUND';
    
    console.log(`✅ API Key: FOUND`);
    console.log(`📏 Length: ${apiKey.length} characters`);
    console.log(`🔑 Prefix: ${apiKey.substring(0, 7)}***`);
    console.log(`\n🧪 Testing Stability AI connectivity...`);

    const testPrompt = "A simple red apple on white background, professional product photography";
    
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [
          {
            text: testPrompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 60000
      }
    );

    diagnostics.apiResponse = {
      status: response.status,
      statusText: response.statusText,
      artifacts: response.data.artifacts?.length || 0
    };

    diagnostics.success = true;
    diagnostics.imageGenerated = response.data.artifacts?.length > 0;

    console.log('✅ API Test: SUCCESS');
    console.log(`📸 Stability AI image generated successfully`);
    console.log('=' .repeat(50));

    return diagnostics;

  } catch (error) {
    diagnostics.success = false;
    diagnostics.error = error.message;
    
    console.log(`\n❌ API Error: ${error.message}`);
    
    if (error.response?.status === 401) {
      console.log('🔴 INVALID API KEY - Your STABILITY_API_KEY is incorrect');
      console.log('   → Check your key at https://platform.stability.ai/account/keys');
    } else if (error.response?.status === 429) {
      console.log('🔴 RATE LIMIT or QUOTA - Check your Stability AI credits');
    } else {
      console.log(`🔴 ERROR: ${error.message}`);
    }
    
    console.log('=' .repeat(50));
    return diagnostics;
  }
};

/**
 * Generate product image using Stability AI
 * @param {Object} params - Product details
 * @returns {String} - Generated image URL (base64 data URI) or fallback
 */
export const generateProductImage = async ({ productName, category, brandTone, platform }) => {
  try {
    const apiKey = process.env.STABILITY_API_KEY;
    
    console.log('\n' + '='.repeat(60));
    console.log('🎨 IMAGE GENERATION DIAGNOSTICS (Stability AI)');
    console.log('='.repeat(60));
    
    // Step 1: Validate API Key
    console.log('\n[STEP 1] Checking Stability AI API Key...');
    if (!apiKey || apiKey.length < 10) {
      console.log('❌ FAILED: STABILITY_API_KEY is undefined or invalid');
      console.log('   → Check your .env file');
      console.log('   → Get key from https://platform.stability.ai/account/keys\n');
      return generateFallbackImage({ productName, category });
    }
    
    console.log(`✅ API Key Found: ${apiKey.substring(0, 7)}*** (${apiKey.length} chars)`);
    
    // Step 2: Product Information
    console.log('\n[STEP 2] Product Information:');
    console.log(`   📦 Product: ${productName}`);
    console.log(`   🏷️  Category: ${category}`);
    console.log(`   🎨 Brand Tone: ${brandTone}`);
    console.log(`   📱 Platform: ${platform}`);

    // Step 3: Generate Prompt with Advanced Prompt Engineering
    console.log('\n[STEP 3] Generating Image Prompt...');
    const imagePrompt = `Professional e-commerce studio product photography, ${productName}, ${category} apparel, 
high-end commercial shoot, ghost mannequin effect, invisible mannequin display technique,
clothing item floating without model, 3D form visible, natural garment shape maintained,
fabric draping naturally showing fit and cut, textile weave and texture in sharp focus,
${brandTone} aesthetic styling, premium quality garment construction details visible,
pristine pure white seamless infinity backdrop, no visible floor or wall seam,
professional studio lighting setup with softbox diffusion, key light and fill light balance,
subtle natural soft shadows for depth, overhead catchlight, even illumination across fabric surface,
product centered in frame, catalog-ready composition, straight-on frontal view, symmetrical positioning,
8k ultra high resolution, tack sharp focus on fabric details, bokeh-free clarity throughout,
color accurate representation, true-to-life material appearance, photorealistic rendering,
commercial fashion photography standards, retail product presentation quality,
no human model, no mannequin visible, no props or accessories in frame,
absolutely no text overlay, no typography, no logos, no branding elements, no watermarks`;
    console.log(`✅ Prompt created (${imagePrompt.length} chars)`);
    console.log(`   Preview: ${imagePrompt.substring(0, 80)}...`);

    // Step 4: Call Stability AI
    console.log('\n[STEP 4] Sending Request to Stability AI...');
    console.log(`   🌐 Model: stable-diffusion-xl-1024-v1-0`);
    console.log(`   📐 Size: 1024x1024`);
    console.log(`   ⏱️  Generating...`);
    
    const startTime = Date.now();
    
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [
          {
            text: imagePrompt,
            weight: 1
          },
          {
            text: `text, typography, letters, words, labels, tags, price tags, size labels, brand names,
logo, logotype, watermark, signature, stamp, copyright mark, trademark symbol,
human model, person, mannequin head, mannequin hands, mannequin visible, body parts,
hanger, clothing rack, props, accessories, jewelry, watches, bags, shoes,
poster design, banner, advertisement layout, graphic design elements, illustrations,
pattern background, textured backdrop, colored background, gradient background, floor visible,
blurry, out of focus, soft focus, motion blur, noise, grain, pixelated, jpeg artifacts,
distorted proportions, warped fabric, unrealistic folds, bad anatomy of garment,
oversaturated colors, color cast, wrong white balance, uneven lighting, harsh shadows, dark shadows,
low resolution, low quality, amateur photography, smartphone photo, casual snapshot,
multiple items, collage, split image, border, frame, vignette, lens distortion`,
            weight: -1
          }
        ],
        cfg_scale: 8.5,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 35,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 60000
      }
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`   ✅ Response received in ${duration}s`);
    console.log(`   📊 Status: ${response.status} ${response.statusText}`);
    console.log(`   🖼️  Artifacts: ${response.data.artifacts?.length || 0}`);

    // Step 5: Convert to Base64
    console.log('\n[STEP 5] Converting Image to Base64...');
    
    if (!response.data.artifacts || response.data.artifacts.length === 0) {
      throw new Error('No image artifacts returned from Stability AI');
    }
    
    const imageBase64 = response.data.artifacts[0].base64;
    const base64DataUri = `data:image/png;base64,${imageBase64}`;
    const imageSizeKB = Math.round(imageBase64.length / 1024);
    
    console.log(`   ✅ Conversion successful`);
    console.log(`   📸 Final image size: ${imageSizeKB} KB`);
    console.log(`   🔗 Image format: base64 data URI`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ IMAGE GENERATION COMPLETE');
    console.log('='.repeat(60) + '\n');
    
    return base64DataUri;

  } catch (error) {
    console.error('❌ Error generating product image:', error.message);
    
    if (error.response?.status === 401) {
      console.log('⚠️  Stability AI authentication failed. Check your API key.');
    } else if (error.response?.status === 429) {
      console.log('⚠️  Rate limit exceeded or insufficient credits.');
    } else if (error.response?.status === 400) {
      console.log('⚠️  Invalid request to Stability AI.');
      console.log(`   Details: ${error.response?.data?.message || 'No details'}`);
    } else {
      console.log('⚠️  Unexpected error during image generation.');
    }
    
    // Return fallback placeholder image instead of crashing
    console.log('🔄 Returning fallback placeholder image...');
    return generateFallbackImage({ productName, category });
  }
};

/**
 * Generate complete marketing asset (copy + image)
 * @param {Object} productData - Product details
 * @returns {Object} - Complete marketing asset with caption, hashtags, CTA, and image
 */
export const generateCompleteAsset = async (productData) => {
  try {
    console.log(`🚀 Starting complete asset generation for: ${productData.productName}`);
    
    // Generate both in parallel for efficiency
    const [marketingCopy, imageUrl] = await Promise.all([
      generateMarketingCopy(productData),
      generateProductImage(productData)
    ]);

    console.log('✅ Complete marketing asset generated successfully');
    console.log(`📸 Final Image URL: ${imageUrl}`);

    // Determine image source for metadata
    const imageSource = imageUrl.startsWith('data:image') ? 'Stability AI SDXL (AI Generated)' : 
                       imageUrl.includes('placehold.co') ? 'Fallback Placeholder' :
                       'AI Generated';

    return {
      caption: marketingCopy.caption,
      hashtags: marketingCopy.hashtags,
      callToAction: marketingCopy.callToAction,
      imageUrl: imageUrl,
      imageSource: imageSource
    };

  } catch (error) {
    console.error('❌ Error generating complete asset:', error.message);
    throw new Error(`Failed to generate complete marketing asset: ${error.message}`);
  }
};

export default {
  generateMarketingCopy,
  generateProductImage,
  generateCompleteAsset
};
