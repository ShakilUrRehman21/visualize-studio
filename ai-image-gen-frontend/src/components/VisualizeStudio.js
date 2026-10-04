import React, { useState } from 'react';
import axios from 'axios';
import cowImage from '../assets/cow.png';
import './VisualizeStudio.css';

const STYLES = [
  { id: 'cinematic', name: 'Cinematic', icon: '🎬', promptSuffix: ', cinematic lighting, ultra-detailed, photorealistic, 8k, dramatic atmosphere, depth of field' },
  { id: 'anime', name: 'Anime / Manga', icon: '🎨', promptSuffix: ', high quality anime style, makoto shinkai style, vibrant colors, detailed line art, aesthetic masterpiece' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌆', promptSuffix: ', neon glow, futuristic cyberpunk city vibes, wet asphalt reflections, volumetric smoke, high tech' },
  { id: '3d-render', name: '3D Render', icon: '💎', promptSuffix: ', Octane 3D render, Pixar style, ray tracing, cute claymation, soft studio lighting, vivid' },
  { id: 'photorealistic', name: 'Photoreal', icon: '📸', promptSuffix: ', award-winning portrait photography, 85mm lens, natural daylight, hyperrealistic, high fidelity' },
  { id: 'fantasy', name: 'Dark Fantasy', icon: '🔮', promptSuffix: ', ethereal dark fantasy, magical particles, ornate runes, epic mysterious environment, trending on ArtStation' },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square (1:1)', icon: '▢', desc: 'Social & Avatars' },
  { id: '16:9', label: 'Landscape (16:9)', icon: '▭', desc: 'Wallpapers & B channels' },
  { id: '9:16', label: 'Portrait (9:16)', icon: '▯', desc: 'Stories & Reels' },
];

const SAMPLE_PROMPTS = [
  "A majestic neon cyberpunk samurai meditating under holographic sakura trees in Tokyo 2088",
  "A bioluminescent jellyfish floating gracefully through an enchanted celestial nebula galaxy",
  "A futuristic glass greenhouse on Mars filled with exotic glowing flora during a crimson sunset",
  "A cozy wizard library tucked in a giant hollow ancient oak tree with floating glowing spellbooks",
  "An ethereal golden dragon coiled gently around a mountain peak shrouded in dawn mist"
];

const VisualizeStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const defaultBackend = isProduction ? 'https://visualizestudio.onrender.com' : 'http://localhost:1312';
  const rawBackendBase = (process.env.REACT_APP_API_URL || defaultBackend).trim();
  const backendBase = rawBackendBase.replace(/\/+$/, '');
  const invokeUrl = `${backendBase}/api/generate`;

  const handleRandomPrompt = () => {
    const random = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setPrompt(random);
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg('');

    // Combine user prompt with active style preset
    const activeStyleObj = STYLES.find(s => s.id === selectedStyle);
    const enrichedPrompt = prompt.trim() + (activeStyleObj ? activeStyleObj.promptSuffix : '');

    const payload = {
      text_prompts: [
        {
          text: enrichedPrompt,
          weight: 1
        },
        {
          text: "blurry, low quality, distorted, deformed, watermark, oversaturated, ugly",
          weight: -1
        }
      ],
      cfg_scale: 7,
      sampler: "K_EULER_ANCESTRAL",
      seed: Math.floor(Math.random() * 1000000),
      steps: 30
    };

    try {
      const res = await axios.post(invokeUrl, payload);
      if (res.data && res.data.artifacts && res.data.artifacts[0]) {
        const base64Data = res.data.artifacts[0].base64;
        const newImgUrl = `data:image/jpeg;base64,${base64Data}`;
        setGeneratedImage(newImgUrl);

        // Add to history
        setHistory(prev => [
          {
            id: Date.now(),
            url: newImgUrl,
            prompt: prompt,
            style: activeStyleObj?.name || 'Default',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev.slice(0, 7) // keep recent 8 items
        ]);
      } else {
        throw new Error("Invalid response format received from image engine.");
      }
    } catch (err) {
      console.error("Image generation error:", err);
      setErrorMsg(
        err.response?.data?.details || 
        err.response?.data?.error || 
        "Failed to communicate with image generation server. Please ensure the backend is running."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imgSrc, filename = 'visualize-studio-artwork.jpg') => {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPrompt = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="vs-root">
      {/* Studio Header */}
      <header className="vs-header">
        <div className="vs-brand">
          <div className="vs-logo-badge">
            <span className="vs-logo-icon">✨</span>
          </div>
          <div>
            <h1 className="vs-title">Visualize <span className="vs-gradient-text">Studio</span></h1>
            <p className="vs-subtitle">Enterprise-grade generative AI visual workstation</p>
          </div>
        </div>

        <div className="vs-header-status">
          <span className="vs-status-dot"></span>
          <span className="vs-status-text">SD-XL Engine Online</span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="vs-workspace">
        {/* Left Control Column */}
        <section className="vs-controls-card">
          <div className="vs-section-header">
            <span className="vs-section-tag">STEP 1</span>
            <h2>Describe Your Vision</h2>
            <button 
              type="button" 
              className="vs-dice-btn" 
              onClick={handleRandomPrompt}
              title="Get prompt inspiration"
            >
              🎲 Surprise Me
            </button>
          </div>

          <div className="vs-textarea-wrapper">
            <textarea
              className="vs-prompt-input"
              rows={4}
              placeholder="e.g. A hyperrealistic futuristic cybernetic observatory overlooking purple nebula..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleGenerate();
                }
              }}
            />
            <div className="vs-input-footer">
              <span className="vs-char-count">{prompt.length} chars</span>
              <span className="vs-shortcut-hint">Press Ctrl + Enter to generate</span>
            </div>
          </div>

          {/* Style Presets */}
          <div className="vs-style-section">
            <div className="vs-section-header">
              <span className="vs-section-tag">STEP 2</span>
              <h3>Aesthetic Style Presets</h3>
            </div>
            <div className="vs-styles-grid">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className={`vs-style-chip ${selectedStyle === style.id ? 'active' : ''}`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <span className="vs-style-icon">{style.icon}</span>
                  <span className="vs-style-label">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Presets */}
          <div className="vs-ratio-section">
            <div className="vs-section-header">
              <span className="vs-section-tag">STEP 3</span>
              <h3>Canvas Ratio</h3>
            </div>
            <div className="vs-ratio-grid">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  className={`vs-ratio-card ${selectedRatio === ratio.id ? 'active' : ''}`}
                  onClick={() => setSelectedRatio(ratio.id)}
                >
                  <span className="vs-ratio-glyph">{ratio.icon}</span>
                  <div className="vs-ratio-text">
                    <strong>{ratio.label}</strong>
                    <small>{ratio.desc}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message if Any */}
          {errorMsg && (
            <div className="vs-error-banner">
              <span className="vs-error-icon">⚠️</span>
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            className={`vs-generate-btn ${isGenerating ? 'generating' : ''}`}
            disabled={isGenerating || !prompt.trim()}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <span className="vs-spinner"></span>
                <span>Synthesizing Canvas...</span>
              </>
            ) : (
              <>
                <span>Generate Artwork</span>
                <span className="vs-arrow-icon">➔</span>
              </>
            )}
          </button>
        </section>

        {/* Right Preview Column */}
        <section className="vs-preview-card">
          <div className="vs-preview-header">
            <div className="vs-preview-badge">
              <span className="vs-preview-indicator"></span>
              LIVE VIEWPORT
            </div>
            {generatedImage && (
              <div className="vs-preview-actions">
                <button 
                  className="vs-action-btn"
                  onClick={() => copyPrompt(prompt)}
                  title="Copy prompt"
                >
                  📋 {copiedNotification ? 'Copied!' : 'Copy Prompt'}
                </button>
                <button 
                  className="vs-action-btn vs-action-primary"
                  onClick={() => downloadImage(generatedImage)}
                  title="Download full resolution image"
                >
                  💾 Download
                </button>
              </div>
            )}
          </div>

          <div className={`vs-canvas-frame ratio-${selectedRatio.replace(':', '-')}`}>
            {isGenerating ? (
              <div className="vs-loading-overlay">
                <div className="vs-pulse-ring"></div>
                <div className="vs-loading-core">
                  <div className="vs-loading-sparkles">✨</div>
                  <h4>Crafting Your Vision</h4>
                  <p>Processing diffusion steps & high-resolution upscaling...</p>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="vs-rendered-container">
                <img 
                  src={generatedImage} 
                  alt={prompt} 
                  className="vs-rendered-image" 
                />
              </div>
            ) : (
              <div className="vs-placeholder-container">
                <img 
                  src={cowImage} 
                  alt="Default showcase" 
                  className="vs-placeholder-image"
                />
                <div className="vs-placeholder-overlay">
                  <span className="vs-placeholder-tag">Ready for Generation</span>
                  <h3>Your masterpiece awaits</h3>
                  <p>Enter a description and click Generate to bring your imagination to life.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* History Showcase Shelf */}
      {history.length > 0 && (
        <section className="vs-history-shelf">
          <div className="vs-history-header">
            <h3>Recent Studio Creations ({history.length})</h3>
            <span className="vs-history-sub">Click any creation to inspect or reload</span>
          </div>

          <div className="vs-history-slider">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="vs-history-item"
                onClick={() => {
                  setGeneratedImage(item.url);
                  setPrompt(item.prompt);
                }}
              >
                <img src={item.url} alt={item.prompt} />
                <div className="vs-history-overlay">
                  <span className="vs-history-style">{item.style}</span>
                  <p className="vs-history-prompt">{item.prompt}</p>
                  <span className="vs-history-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="vs-footer">
        <p>Visualize Studio &bull; Powered by Stable Diffusion XL & Nvidia AI Cloud</p>
      </footer>
    </div>
  );
};

export default VisualizeStudio;
