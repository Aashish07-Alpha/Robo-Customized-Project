import { useState } from 'react';
import './MarketingForm.css';

const MarketingForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: 't-shirt',
    brandTone: 'casual',
    platform: 'Instagram'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="marketing-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>✨ AI Marketing Asset Generator</h2>
        <p>Create stunning marketing content for your fashion products</p>
      </div>

      <div className="form-group">
        <label htmlFor="productName">
          <span className="label-icon">🏷️</span>
          Product Name
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="e.g., Premium Cotton T-Shirt"
          required
          disabled={isLoading}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">
          <span className="label-icon">👕</span>
          Product Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="form-select"
        >
          <option value="t-shirt">T-Shirt</option>
          <option value="hoodie">Hoodie</option>
          <option value="shoes">Shoes</option>
          <option value="jacket">Jacket</option>
          <option value="dress">Dress</option>
          <option value="pants">Pants</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="brandTone">
          <span className="label-icon">🎨</span>
          Brand Tone
        </label>
        <select
          id="brandTone"
          name="brandTone"
          value={formData.brandTone}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="form-select"
        >
          <option value="luxury">Luxury</option>
          <option value="casual">Casual</option>
          <option value="streetwear">Streetwear</option>
          <option value="minimal">Minimal</option>
          <option value="vintage">Vintage</option>
          <option value="sporty">Sporty</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="platform">
          <span className="label-icon">📱</span>
          Marketing Platform
        </label>
        <select
          id="platform"
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="form-select"
        >
          <option value="Instagram">Instagram</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Website">Website</option>
          <option value="Facebook">Facebook</option>
          <option value="Twitter">Twitter</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Generating...
          </>
        ) : (
          <>
            <span className="button-icon">🚀</span>
            Generate Marketing Asset
          </>
        )}
      </button>
    </form>
  );
};

export default MarketingForm;
