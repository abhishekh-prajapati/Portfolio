# Abhishekh Prajapati - Portfolio Website

A modern, responsive developer portfolio website built with HTML5, Vite, Tailwind CSS, and GSAP animations.

## Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Animations**: GSAP 3 (ScrollTrigger, Flip, ScrollToPlugin)
- **Smooth Scroll**: Lenis
- **Text Effects**: SplitType
- **Build Tool**: Vite

## Project Structure
```
├── index.html           # Main HTML document
├── package.json         # Project metadata and dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── src/                 # Application logic and custom styling
│   ├── main.js          # GSAP timelines, Lenis scroll, SplitType
│   └── style.css         # Tailwind directives and custom CSS
├── public/              # Static assets and icons
│   └── _astro/          # Tech stack brand icons
└── image/               # Project images and personal images
```

## How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## How to Manually Upload to GitHub (Web UI)

1. Open [GitHub](https://github.com/) in your browser and sign in.
2. Click **New** to create a new repository (name it `Portfolio` or your preferred name).
3. Do NOT initialize with a README (keep it empty).
4. On the repository page, click **uploading an existing file**.
5. Drag and drop all files and folders inside this folder (`github_manual_upload`) directly into GitHub's file drop area.
6. Scroll down, write a commit message (e.g. `Initial portfolio commit`), and click **Commit changes**.
