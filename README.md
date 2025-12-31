# Ditosis - Synthetic Data Solutions

A modern, dark-themed website for Ditosis, a synthetic data company that provides high-quality synthetic datasets for AI training and fine-tuning.

🌐 **Live Demo**: [https://yourusername.github.io/Ditosis](https://yourusername.github.io/Ditosis)

![Ditosis](https://img.shields.io/badge/Ditosis-Synthetic%20Data-00F5A0)

## ✨ Features

- **Modern Dark Theme** - Inspired by modal.com with cyan/teal gradient accents
- **Fully Responsive** - Works beautifully on desktop, tablet, and mobile
- **Smooth Animations** - Scroll-triggered animations and particle effects
- **No Backend Required** - Pure HTML, CSS, and JavaScript
- **GitHub Pages Ready** - Deploy instantly with zero configuration

## 📁 Project Structure

```
Ditosis/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript for interactivity
├── assets/
│   └── ditosis-icon.svg  # Favicon
└── README.md
```

## 🚀 Deploy to GitHub Pages

### Option 1: Quick Deploy

1. Push this repo to GitHub
2. Go to **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select **main** branch and **/ (root)** folder
5. Click **Save**
6. Your site will be live at `https://yourusername.github.io/Ditosis`

### Option 2: Using GitHub CLI

```bash
gh repo create Ditosis --public --source=. --push
# Then enable Pages in Settings
```

## 🎨 Design Features

- **Color Scheme**: Dark theme with cyan/teal gradient (#00F5A0 → #00D9F5)
- **Typography**: Outfit font family
- **Animations**: Floating particles, scroll reveals, hover effects
- **Sections**:
  - Hero with animated particles and stats
  - About with company highlights
  - Services grid (6 data types)
  - Platform features with code preview
  - Industry use cases
  - Customer testimonials
  - Service request form
  - Footer with links

## 🛠️ Local Development

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000`

## 📝 Customization

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --accent-primary: #00F5A0;
  --accent-secondary: #00D9F5;
  /* ... */
}
```

### Update Content
Edit `index.html` to change:
- Company name and branding
- Section content and copy
- Testimonials
- Footer links

### Modify Animations
Edit `script.js` to customize:
- Particle count and behavior
- Scroll animation timing
- Form behavior

## 📄 License

MIT License - Feel free to use this template for your projects.

## 📧 Contact

- **Website**: ditosis.com
- **Email**: hello@ditosis.com
