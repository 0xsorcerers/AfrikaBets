import React, { useState } from 'react';
import { CreateMarketInput } from '../types/market';

interface CreateMarketModalProps {
  onCreate: (marketData: CreateMarketInput) => void;
  onClose: () => void;
}

const CATEGORIES = ['Politics', 'Sports', 'Technology', 'Entertainment', 'Business', 'Crypto', 'Other'];

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ onCreate, onClose }) => {
  const [formData, setFormData] = useState<Partial<CreateMarketInput>>({
    title: '',
    description: '',
    category: 'Politics',
    backgroundUrl: '',
    backgroundType: 'image',
    closesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tags: [],
    options: ['', '']
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...(prev.options || []), '']
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.description?.trim() || !formData.options?.some(o => o.trim())) {
      alert('Please fill in all required fields');
      return;
    }

    onCreate({
      title: formData.title!,
      description: formData.description!,
      category: formData.category || 'Politics',
      backgroundUrl: formData.backgroundUrl || undefined,
      backgroundType: formData.backgroundType as any,
      closesAt: formData.closesAt || new Date(),
      tags: formData.tags || [],
      options: formData.options!.filter(o => o.trim())
    });

    onClose();
  };

  return (
    <>
      <style>{`
      .create-market-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 1001;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        overflow-y: auto;
      }

      .create-market-panel {
        background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
        border: 1px solid var(--border-color);
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-lg);
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .create-header {
        padding: 2rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .create-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      .close-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.3s ease;
      }

      .close-btn:hover {
        color: var(--text-primary);
      }

      .create-form {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-label {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.95rem;
      }

      .form-input,
      .form-textarea,
      .form-select {
        padding: 0.75rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-family: inherit;
        transition: all 0.3s ease;
      }

      .form-input:focus,
      .form-textarea:focus,
      .form-select:focus {
        outline: none;
        border-color: var(--accent-cyan);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
      }

      .form-textarea {
        resize: vertical;
        min-height: 100px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .options-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .option-input-wrapper {
        display: flex;
        gap: 0.5rem;
      }

      .option-input {
        flex: 1;
        padding: 0.75rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
      }

      .option-input:focus {
        outline: none;
        border-color: var(--accent-cyan);
      }

      .btn-remove {
        padding: 0.75rem 1rem;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        color: var(--accent-red);
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn-remove:hover {
        background: var(--accent-red);
        color: #fff;
      }

      .btn-add {
        padding: 0.75rem 1.5rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--accent-cyan);
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn-add:hover {
        background: var(--border-color);
        color: #fff;
      }

      .tags-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .tag-input-wrapper {
        display: flex;
        gap: 0.5rem;
      }

      .tag-input {
        flex: 1;
        padding: 0.75rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
      }

      .tag-input:focus {
        outline: none;
        border-color: var(--accent-cyan);
      }

      .tags-display {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .tag-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--bg-secondary);
        border: 1px solid var(--accent-cyan);
        color: var(--accent-cyan);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.875rem;
      }

      .tag-close {
        cursor: pointer;
        font-weight: bold;
      }

      .help-text {
        color: var(--text-muted);
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .form-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
      }

      .btn-submit {
        padding: 1rem;
        background: linear-gradient(135deg, var(--accent-green), #00dd38);
        color: #000;
        font-weight: 700;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 255, 65, 0.2);
      }

      .btn-cancel {
        padding: 1rem;
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-cancel:hover {
        background: var(--border-color);
      }

      @media (max-width: 768px) {
        .create-market-panel {
          max-height: 100vh;
          border-radius: 16px 16px 0 0;
        }

        .create-form {
          padding: 1.5rem;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .form-actions {
          grid-template-columns: 1fr;
        }
      }
    `}</style>

    <div className="create-market-overlay" onClick={onClose}>
      <div className="create-market-panel" onClick={(e) => e.stopPropagation()}>
        <div className="create-header">
          <h2 className="create-title">Create New Market</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Market Title *</label>
            <input
              type="text"
              className="form-input"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              placeholder="e.g., Will Bitcoin reach $100k by 2025?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Provide context and details for the market..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={formData.category || 'Politics'}
                onChange={handleInputChange}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Closes At</label>
              <input
                type="datetime-local"
                className="form-input"
                name="closesAt"
                value={formData.closesAt ? new Date(formData.closesAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  closesAt: new Date(e.target.value)
                }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Background Media URL (Image/GIF/Video, Max 5MB)</label>
            <input
              type="url"
              className="form-input"
              name="backgroundUrl"
              value={formData.backgroundUrl || ''}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
            <div className="help-text">Supported: JPG, PNG, GIF, MP4, WebM</div>
          </div>

          <div className="form-group">
            <label className="form-label">Media Type</label>
            <select
              className="form-select"
              name="backgroundType"
              value={formData.backgroundType || 'image'}
              onChange={handleInputChange}
            >
              <option value="image">Image</option>
              <option value="gif">GIF</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Market Options *</label>
            <div className="options-section">
              {(formData.options || []).map((option, index) => (
                <div key={index} className="option-input-wrapper">
                  <input
                    type="text"
                    className="option-input"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {formData.options!.length > 2 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-add"
                onClick={addOption}
              >
                + Add Option
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tags-section">
              <div className="tag-input-wrapper">
                <input
                  type="text"
                  className="tag-input"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-add"
                  onClick={addTag}
                >
                  Add Tag
                </button>
              </div>
              {(formData.tags || []).length > 0 && (
                <div className="tags-display">
                  {formData.tags!.map((tag, index) => (
                    <div key={index} className="tag-badge">
                      {tag}
                      <span className="tag-close" onClick={() => removeTag(index)}>✕</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Market
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};
