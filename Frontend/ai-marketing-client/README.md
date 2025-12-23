# Frontend - AI Marketing Client

React + Vite frontend for AI-powered marketing content generation.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Dependencies

```bash
npm install react react-dom axios
npm install --save-dev vite @vitejs/plugin-react
```

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Features

- **Modern UI**: Clean, professional interface
- **Real-time Loading**: Visual feedback during AI generation
- **Responsive Design**: Works on all devices
- **Copy to Clipboard**: One-click content copying
- **Image Download**: Direct download of generated images
- **Error Handling**: User-friendly error messages

## 📁 Components

### MarketingForm
Form component for product input:
- Product name
- Category selection
- Brand tone selection
- Platform selection

### ResultDisplay
Display component for AI-generated content:
- Product image
- Marketing caption
- Hashtags
- Call-to-action
- Copy buttons

## 🎯 Usage

1. Fill in product details
2. Click "Generate Marketing Asset"
3. Wait for AI processing (15-30s)
4. View and copy results

## 🎨 Customization

### Colors
Edit color scheme in CSS files:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Background gradient: Update in `App.css`

### Brand Tones
Add new tones in `MarketingForm.jsx`:
```jsx
<option value="newTone">New Tone</option>
```

Also update backend enum in `MarketingRequest.js`

## 🚀 Build for Production

```bash
npm run build
```

Output in `dist/` directory.

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

Set environment variable:
- `VITE_API_URL`: Your backend URL

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

## 📝 Notes

- Vite dev server: Hot Module Replacement (HMR)
- API timeout: 60 seconds (for AI processing)
- Image loading: Lazy loading enabled

