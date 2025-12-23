import './ResultDisplay.css';
import { useState } from 'react';

const ResultDisplay = ({ result, onClear }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!result) return null;

  const { caption, hashtags, callToAction, imageUrl, imageSource } = result.result;
  const { productName, category, brandTone, platform, processingTime } = result;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Handle image load error with fallback
  const handleImageError = (e) => {
    console.error('Image load error:', e);
    if (!imageError) {
      setImageError(true);
      e.target.onerror = null;
      // Use a guaranteed working placeholder
      e.target.src = `https://placehold.co/1024x1024/3b82f6/white?text=${encodeURIComponent(productName)}`;
    }
  };

  return (
    <div className="result-display">
      <div className="result-header">
        <h2>✨ Generated Marketing Asset</h2>
        <button onClick={onClear} className="clear-button">
          ✕ Clear
        </button>
      </div>

      <div className="result-meta">
        <span className="meta-item">📦 {productName}</span>
        <span className="meta-item">🏷️ {category}</span>
        <span className="meta-item">🎨 {brandTone}</span>
        <span className="meta-item">📱 {platform}</span>
        <span className="meta-item">⚡ {processingTime}ms</span>
      </div>

      <div className="result-content">
        {/* Product Image */}
        {imageUrl && (
          <div className="result-section image-section">
            <h3>📸 Product Visual</h3>
            {imageSource && (
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Source: {imageSource}
              </p>
            )}
            <div className="image-container">
              <img 
                src={imageUrl} 
                alt={`${productName} - ${category}`}
                className="product-image"
                loading="eager"
                onError={handleImageError}
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
              <a 
                href={imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="image-download"
              >
                ⬇️ View Full Image
              </a>
            </div>
          </div>
        )}

        {/* Caption */}
        <div className="result-section">
          <div className="section-header">
            <h3>✍️ Marketing Caption</h3>
            <button 
              onClick={() => copyToClipboard(caption)}
              className="copy-button"
            >
              📋 Copy
            </button>
          </div>
          <p className="caption-text">{caption}</p>
        </div>

        {/* Hashtags */}
        <div className="result-section">
          <div className="section-header">
            <h3>#️⃣ Hashtags</h3>
            <button 
              onClick={() => copyToClipboard(hashtags.join(' '))}
              className="copy-button"
            >
              📋 Copy
            </button>
          </div>
          <div className="hashtags-container">
            {hashtags.map((tag, index) => (
              <span key={index} className="hashtag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="result-section">
          <div className="section-header">
            <h3>📣 Call to Action</h3>
            <button 
              onClick={() => copyToClipboard(callToAction)}
              className="copy-button"
            >
              📋 Copy
            </button>
          </div>
          <p className="cta-text">{callToAction}</p>
        </div>

        {/* Full Copy */}
        <div className="result-section">
          <div className="section-header">
            <h3>📄 Complete Copy</h3>
            <button 
              onClick={() => copyToClipboard(`${caption}\n\n${hashtags.join(' ')}\n\n${callToAction}`)}
              className="copy-button primary"
            >
              📋 Copy All
            </button>
          </div>
          <div className="complete-copy">
            <p>{caption}</p>
            <p className="hashtags-line">{hashtags.join(' ')}</p>
            <p className="cta-line">{callToAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
