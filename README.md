# ToolBox Radio Website

A modern, responsive website for ToolBox Radio - the construction industry's premier music and radio provider, exclusively available through the CMS Desk platform.

## 🎵 Features

### Core Functionality
- **Floating Radio Player**: Persistent radio player that stays in place while navigating different pages
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI/UX**: Clean, professional design targeting the construction industry
- **Smooth Animations**: Engaging scroll animations and interactive elements

### Key Sections
1. **Hero Section**: Eye-catching introduction with construction-themed visuals
2. **About Section**: Features and benefits of ToolBox Radio
3. **CMS Desk Integration**: Showcases the exclusive partnership with CMS Desk
4. **Advertising Packages**: Three-tier advertising options with pricing
5. **Contact Form**: Interactive contact form with validation
6. **Floating Player**: Embedded radio player that persists across page navigation

### Technical Features
- **Mobile-First Design**: Optimized for mobile devices
- **Smooth Scrolling**: Seamless navigation between sections
- **Form Validation**: Client-side validation with user feedback
- **Loading Animations**: Smooth page load and element animations
- **Counter Animations**: Animated statistics display
- **Parallax Effects**: Subtle parallax scrolling in hero section

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required - everything is included via CDN

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. The website is ready to use!

### File Structure
```
ToolBox Radio/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563eb (Used for buttons, links, accents)
- **Secondary Purple**: #667eea to #764ba2 (Gradient backgrounds)
- **Success Green**: #10b981 (Success states, checkmarks)
- **Error Red**: #ef4444 (Error states, warnings)
- **Neutral Grays**: #1f2937, #6b7280, #f8fafc (Text, backgrounds)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately across device sizes

### Components
- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Feature cards, advertising packages, statistics
- **Forms**: Contact form with validation
- **Navigation**: Fixed navbar with mobile hamburger menu

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## 🎵 Radio Player Integration

The floating radio player uses the provided embed code:
```html
<iframe src="http://134.209.28.199/public/toolbox_radio/embed?theme=dark" 
        frameborder="0" 
        allowtransparency="true" 
        style="width: 100%; min-height: 150px; border: 0;">
</iframe>
```

### Player Features
- **Collapsible**: Users can minimize/maximize the player
- **Persistent**: Stays in position while navigating
- **Responsive**: Adapts to different screen sizes
- **Dark Theme**: Matches the embedded player theme

## 💼 Advertising Packages

### Basic Package - $299/month
- 30-second audio spots
- 5 plays per day
- Basic analytics
- Construction industry targeting

### Professional Package - $599/month (Most Popular)
- 30 & 60-second audio spots
- 15 plays per day
- Advanced analytics & reporting
- Geographic targeting
- Banner ad placement
- Priority scheduling

### Premium Package - $999/month
- Custom audio production
- Unlimited plays
- Real-time analytics dashboard
- Multi-region targeting
- Premium banner placement
- Dedicated account manager
- Custom sponsorship opportunities

## 🔧 Customization

### Modifying Colors
Update the CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #667eea;
    --success-color: #10b981;
    --error-color: #ef4444;
}
```

### Adding New Sections
1. Add HTML structure to `index.html`
2. Add corresponding styles to `styles.css`
3. Add any JavaScript functionality to `script.js`

### Updating Content
- **Company Information**: Update contact details in the contact section
- **Pricing**: Modify advertising package prices and features
- **Statistics**: Update the numbers in the advertising stats section

## 🌐 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## 📞 Contact Information

For questions about the website or ToolBox Radio:
- **Email**: info@toolboxradio.com
- **Phone**: (555) 123-4567
- **Business Hours**: Mon-Fri: 8AM-6PM EST

## 🚀 Deployment

The website is ready for deployment to any web hosting service:

1. **Static Hosting**: Upload files to services like Netlify, Vercel, or GitHub Pages
2. **Traditional Hosting**: Upload to any web server
3. **CDN**: Serve static files through a CDN for better performance

### Performance Optimization
- Images are optimized and use modern formats
- CSS and JavaScript are minified-ready
- Fonts are loaded efficiently via Google Fonts
- No heavy dependencies or frameworks

## 📄 License

This project is proprietary to ToolBox Radio. All rights reserved.

---

**Built with ❤️ for the construction industry** 