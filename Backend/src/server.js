import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import marketingRoutes from './routes/marketingRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware - Allow both frontend ports
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  'https://robo-customized-project.vercel.app',
  'https://robo-customized-project-i4ix.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed origins or is a Vercel preview deployment
    if (allowedOrigins.includes(origin) || (origin && origin.includes('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
connectDB();

// Image proxy endpoint to handle CORS issues with external images
app.get('/api/proxy-image', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image URL is required' 
      });
    }

    // Fetch the image
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    // Get the image buffer
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Set proper headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Send the image
    res.send(Buffer.from(imageBuffer));
    
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to proxy image' 
    });
  }
});

// Routes
app.use('/api', marketingRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 AI Product Marketing & Visualization Tool API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generate: 'POST /api/generate',
      history: 'GET /api/history',
      request: 'GET /api/request/:requestId'
    },
    documentation: 'https://github.com/yourusername/ai-marketing-tool'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🚀 AI Marketing Tool Backend Server          ║
║  📡 Server running on port ${PORT}             ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
║  📝 API: http://localhost:${PORT}              ║
╚═══════════════════════════════════════════════╝
  `);
});

export default app;
