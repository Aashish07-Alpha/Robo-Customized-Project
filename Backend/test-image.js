// Quick test script to verify image generation
import { generateProductImage } from './src/services/aiService.js';

const testProducts = [
  { productName: 'Summer Dress', category: 'Fashion', brandTone: 'casual' },
  { productName: 'Leather Jacket', category: 'Apparel', brandTone: 'luxury' },
  { productName: 'Running Shoes', category: 'Footwear', brandTone: 'sporty' }
];

console.log('🧪 Testing Image Generation...\n');

for (const product of testProducts) {
  try {
    const imageUrl = await generateProductImage(product);
    console.log(`✅ ${product.productName}:`);
    console.log(`   URL: ${imageUrl}\n`);
  } catch (error) {
    console.error(`❌ ${product.productName} failed:`, error.message);
  }
}

console.log('🏁 Test Complete!');
console.log('💡 Try opening the URLs in your browser to verify they load.\n');
process.exit(0);
