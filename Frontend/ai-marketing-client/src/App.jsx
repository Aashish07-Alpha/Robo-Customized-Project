import { useState } from 'react';
import MarketingForm from './components/MarketingForm';
import ResultDisplay from './components/ResultDisplay';
import { generateMarketingAsset } from './services/api';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Generating marketing asset with:', formData);
      const response = await generateMarketingAsset(formData);
      
      if (response.success) {
        setResult(response.data);
        console.log('Marketing asset generated successfully');
      } else {
        throw new Error(response.message || 'Failed to generate asset');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to generate marketing asset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="navbar-logo">🎨</span>
            <span className="navbar-title">Product Marketing & Visualization Tool</span>
          </div>
          <div className="navbar-tagline">
            Professional Marketing Solutions for Fashion & E-Commerce Brands
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <button onClick={() => setError(null)} className="error-close">
                ✕
              </button>
            </div>
          )}

          <div className="content-grid">
            <div className="form-column">
              <MarketingForm 
                onSubmit={handleGenerate} 
                isLoading={isLoading}
              />
            </div>

            <div className="result-column">
              {isLoading && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <h3>🎨 Generating your marketing asset...</h3>
                  <p>Our AI is crafting the perfect content for your product</p>
                  <div className="loading-steps">
                    <div className="step">✍️ Writing compelling copy...</div>
                    <div className="step">🎨 Creating product visual...</div>
                    <div className="step">✨ Polishing final result...</div>
                  </div>
                </div>
              )}

              {!isLoading && !result && !error && (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>Ready to generate?</h3>
                  <p>Fill in the form on the left and click "Generate Marketing Asset" to create AI-powered marketing content for your fashion product.</p>
                  <div className="features">
                    <div className="feature">
                      <span className="feature-icon">✍️</span>
                      <span>AI-Generated Copy</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">📸</span>
                      <span>Product Visuals</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">#️⃣</span>
                      <span>Smart Hashtags</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">🎯</span>
                      <span>Conversion-Focused CTA</span>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <ResultDisplay 
                  result={result} 
                  onClear={handleClear}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-icon">⚡</span>
            <p className="footer-text">Built by <span className="creator-name">Aashish Suryawanshi</span></p>
          </div>
          <p className="footer-year">© 2025 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

