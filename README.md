# Keychron Landing Page

A premium, highly-responsive e-commerce landing page redesign for Keychron Custom Mechanical Keyboards. 

Built as a front-end showcase focusing on clean tech aesthetics, fluid CSS grid layouts, and minimalist product presentations. 

[Demo Live](https://john1yahya.github.io/keyboard-landing-page/)

## Features
- **Clean E-commerce Aesthetic**: Employs a bright, off-white/grey color palette with deep dark backgrounds and Keychron's signature orange accents to highlight products effectively.
- **Responsive Layouts**: Designed to be fully responsive using CSS Grid and Flexbox, breaking perfectly on tablets and mobile devices.
- **Dynamic Interactions**: Features scroll-reveal fade-in effects, a smart auto-hiding navigation bar, and elegant hover-zoom micro-interactions on product cards.
- **AI Photography**: Uses entirely generative AI photorealistic imagery for product shots (Q Series, K Series, V Series).

## Tech Stack
- **HTML5**: Semantic tags for accessibility and structure.
- **CSS3 (Vanilla)**: Custom CSS properties (variables), Flexbox, CSS Grid, and custom animations.
- **JavaScript (Vanilla)**: Interaction logic for mobile menus, Intersection Observer for scroll animations, and dynamic header visibility. Included a mock UI state handler for the "Add to Cart" function.
- **Icons**: Lucide Icons.

## Setup & Preview
There are no build steps required. To preview the landing page, simply open `index.html` in your favorite web browser.

```bash
# Clone the repository
git clone https://github.com/yourusername/keyboard-landing-page.git

# Open index.html directly
cd keyboard-landing-page
xdg-open index.html # Linux
open index.html     # macOS
start index.html    # Windows
```

## Structure
- `index.html`: Main landing page structure.
- `style.css`: All styling, color variables, media queries, and animations.
- `script.js`: Interactive functionality.
- `assets/`: Contains the high-resolution AI-generated product photography used throughout the site.
