# ✨ Visualize Studio

> Next-generation generative AI visual workstation powered by Stable Diffusion XL & NVIDIA AI Foundation.

---

## 🎨 Overview

**Visualize Studio** transforms creative textual concepts into high-resolution, photorealistic digital artwork and illustrations. With curated aesthetic styles, customizable aspect ratios, prompt inspiration tools, and live session galleries, Visualize Studio turns text prompts into studio-quality visuals.

---

## 🌟 Key Features

* **🎭 Aesthetic Style Presets**: 
  - *Cinematic* (dramatic lighting, 8k depth of field)
  - *Anime / Manga* (Makoto Shinkai style, vibrant palettes)
  - *Cyberpunk* (neon luminescence, futuristic reflections)
  - *3D Render* (Octane ray-tracing, soft studio claymation)
  - *Photoreal* (85mm portrait photography fidelity)
  - *Dark Fantasy* (mystical runes, ethereal atmosphere)
* **📐 Canvas Aspect Ratios**: Square (1:1), Landscape (16:9), and Portrait (9:16).
* **🎲 Surprise Me Prompt Crafter**: One-click generation of rich, imaginative prompt ideas.
* **⚡ One-Click Copy & Download**: Save high-resolution outputs directly or copy prompts with a click.
* **🖼️ Session History Gallery**: Live showcase slider of creations generated during your active session.
* **🌌 Ultra-Modern Dark UI**: Designed with glassmorphism, radial glow backdrops, and refined micro-interactions.

---

## 🛠️ Tech Stack

- **Frontend**: React, CSS3 (Glassmorphism & Custom Design Tokens), Axios
- **Backend**: Node.js, Express.js, Axios, CORS, Dotenv
- **Model**: Stable Diffusion XL via NVIDIA Cloud API

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd "AI Image Generator"
npm install
node server.js
```
The server will run on `http://localhost:1312`.

### 2. Frontend Setup

```bash
cd ai-image-gen-frontend
npm install
npm start
```
The studio interface will open on `http://localhost:3000`.

---

## 📁 Project Structure

```
Visualize Studio
├── AI Image Generator/        # Express Backend Server
│   ├── server.js              # REST endpoints (/api/generate)
│   ├── .env                   # NVIDIA API Key configuration
│   └── package.json
└── ai-image-gen-frontend/     # React Studio Client
    ├── src/
    │   ├── components/
    │   │   ├── VisualizeStudio.js     # Main Studio component
    │   │   └── VisualizeStudio.css    # Aesthetics & Glassmorphism styles
    │   ├── App.js
    │   └── index.css                  # Global design tokens
    └── public/
```
