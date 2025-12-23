# 🎨 Product Marketing & Visualization Tool

A professional full-stack application that generates compelling marketing content and high-quality product images for fashion and e-commerce brands. Built with modern technologies and powered by advanced AI models.

## ✨ Features

- **🖼️ Product Image Generation**: Creates ultra-realistic studio-quality product photographs using Stability AI SDXL
- **✍️ Marketing Copy Generation**: Generates engaging captions, hashtags, and CTAs using OpenAI GPT-4o-mini
- **🎯 Brand Tone Customization**: Supports multiple brand voices (luxury, casual, streetwear, minimal, vintage, sporty)
- **📱 Multi-Platform Support**: Optimized content for Instagram, Facebook, Twitter, and Pinterest
- **💾 Database Storage**: MongoDB integration for saving and managing marketing assets
- **🎨 Modern UI**: Beautiful dark-themed interface with glassmorphism effects and smooth animations
- **📊 Real-time Generation**: Live progress tracking and instant results display

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **Stability AI SDXL** - Image generation
- **OpenAI GPT-4o-mini** - Marketing copy generation
- **Axios** - API requests
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB Atlas Account** - [Sign up free](https://www.mongodb.com/cloud/atlas/register)
- **Stability AI API Key** - [Get key](https://platform.stability.ai/account/keys)
- **OpenAI API Key** - [Get key](https://platform.openai.com/api-keys)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd RoboCustomized
```

### 2. Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Create .env file
# Copy the example below and fill in your credentials
```

Create a `.env` file in the `Backend` directory with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database-name?retryWrites=true&w=majority

# Stability AI API Configuration (for product images)
STABILITY_API_KEY=your_stability_ai_api_key_here

# OpenAI API Configuration (for marketing copy)
OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to Frontend directory (from Backend)
cd ../Frontend/ai-marketing-client

# Install dependencies
npm install
```

### 4. Get Your API Keys

#### MongoDB Atlas Setup:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password in the connection string

#### Stability AI Setup:
1. Visit [Stability AI Platform](https://platform.stability.ai/)
2. Create an account or sign in
3. Navigate to Account → API Keys
4. Generate a new API key
5. Copy the key (starts with `sk-`)

#### OpenAI Setup:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (starts with `sk-proj-` or `sk-`)

## 🎮 Running the Application

### Start Backend Server

```bash
# From Backend directory
cd Backend

# Start with nodemon (auto-restart on changes)
npm run dev

# OR start normally
npm start
```

Backend will run on: `http://localhost:5000`

### Start Frontend Development Server

```bash
# From Frontend directory (in a new terminal)
cd Frontend/ai-marketing-client

# Start Vite dev server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📁 Project Structure

```
RoboCustomized/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   └── marketingController.js  # Request handlers
│   │   ├── models/
│   │   │   └── MarketingRequest.js  # MongoDB schema
│   │   ├── routes/
│   │   │   └── marketingRoutes.js   # API endpoints
│   │   ├── services/
│   │   │   └── aiService.js         # AI integrations (Stability AI, OpenAI)
│   │   └── server.js                # Express server setup
│   ├── .env                         # Environment variables
│   └── package.json
│
├── Frontend/
│   └── ai-marketing-client/
│       ├── src/
│       │   ├── components/
│       │   │   ├── MarketingForm.jsx     # Input form
│       │   │   ├── MarketingForm.css
│       │   │   ├── ResultDisplay.jsx     # Results display
│       │   │   └── ResultDisplay.css
│       │   ├── services/
│       │   │   └── api.js                # API client
│       │   ├── App.jsx                   # Main component
│       │   ├── App.css                   # Main styles
│       │   └── main.jsx                  # Entry point
│       ├── public/
│       ├── index.html
│       └── package.json
│
└── README.md                        # This file
```

## 🎯 Usage Guide

### Generating Marketing Content

1. **Fill in Product Details:**
   - Product Name (e.g., "Men's Linen Cotton Pants")
   - Category (e.g., Pants, Shirts, Jackets)
   - Brand Tone (luxury, casual, streetwear, minimal, vintage, sporty)
   - Target Platform (Instagram, Facebook, Twitter, Pinterest)

2. **Click "Generate Marketing Asset"**
   - Wait for processing (usually 10-30 seconds)
   - Backend will generate both image and marketing copy

3. **View Results:**
   - Ultra-realistic product image (1024x1024)
   - Engaging caption tailored to your brand tone
   - Platform-optimized hashtags
   - Compelling call-to-action
   - Copy buttons for easy sharing

4. **Save & Download:**
   - Asset is automatically saved to MongoDB
   - Download image directly
   - Copy text content with one click

## 🔧 API Endpoints

### Backend API

```
POST /api/marketing/generate
```
Generates complete marketing asset (image + copy)

**Request Body:**
```json
{
  "productName": "Men's Casual Shirt",
  "category": "Shirts",
  "brandTone": "casual",
  "platform": "instagram"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "data:image/png;base64,...",
    "caption": "Marketing caption...",
    "hashtags": ["#fashion", "#menswear", ...],
    "callToAction": "Shop now!",
    "metadata": {...}
  }
}
```

```
GET /api/test-hf
```
Tests Stability AI API connectivity and diagnostics

## 🎨 Customization

### Changing AI Models

**Image Generation** (in `Backend/src/services/aiService.js`):
- Model: `stable-diffusion-xl-1024-v1-0`
- Size: 1024x1024
- Steps: 35
- CFG Scale: 8.5

**Marketing Copy** (in `Backend/src/services/aiService.js`):
- Model: `gpt-4o-mini`
- Temperature: 0.8
- Max Tokens: 500

### Adding New Brand Tones

Edit `Backend/src/services/aiService.js` and add to `captionTemplates` and `ctaTemplates` objects.

### Styling Changes

- Main app styles: `Frontend/ai-marketing-client/src/App.css`
- Form styles: `Frontend/ai-marketing-client/src/components/MarketingForm.css`
- Results styles: `Frontend/ai-marketing-client/src/components/ResultDisplay.css`

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct
- Verify all API keys are set in `.env`
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS configuration in `Backend/src/server.js`
- Ensure API URL in `Frontend/src/services/api.js` is correct

### Image generation fails
- Verify Stability AI API key is valid
- Check your API credits/quota
- Review backend console for error messages

### Marketing copy generation fails
- Verify OpenAI API key is valid
- Ensure you have available credits
- Check rate limits on your OpenAI account

### MongoDB connection issues
- Whitelist your IP address in MongoDB Atlas
- Verify database user credentials
- Check connection string format

## 📊 Performance Tips

- Images are generated at 1024x1024 (high quality but may take 15-30 seconds)
- Use appropriate CFG scale (7-9) for best results
- Higher steps (30-40) = better quality but slower generation
- Consider implementing caching for repeated requests

## 🔐 Security Notes

- **Never commit `.env` file to version control**
- Add `.env` to `.gitignore`
- Rotate API keys regularly
- Use environment variables for all secrets
- Implement rate limiting for production
- Add authentication for production deployment

## 🚀 Production Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables in hosting platform
2. Update `FRONTEND_URL` to your production frontend URL
3. Ensure MongoDB Atlas allows connections from hosting IP
4. Use production build: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Update API URL in `src/services/api.js` to backend URL
2. Build production bundle: `npm run build`
3. Deploy the `dist` folder
4. Configure environment variables if needed

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| PORT | Backend server port | Yes | 5000 |
| MONGODB_URI | MongoDB connection string | Yes | mongodb+srv://... |
| STABILITY_API_KEY | Stability AI API key | Yes | sk-... |
| OPENAI_API_KEY | OpenAI API key | Yes | sk-proj-... |
| FRONTEND_URL | Frontend URL for CORS | Yes | http://localhost:5173 |
| NODE_ENV | Environment mode | No | development |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Built by Aashish Suryawanshi**

---

## 📞 Support

For issues and questions:
- Check existing documentation
- Review troubleshooting section
- Check backend console logs for errors
- Test API connectivity using `/api/test-hf` endpoint

---

**Happy Marketing! 🎨✨**
