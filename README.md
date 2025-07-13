# ToolBox Radio - Construction Industry Radio Station

A modern, responsive website for ToolBox Radio, a radio station dedicated to the construction industry. Built with HTML5, CSS3, and JavaScript, featuring a live audio player and iOS-style design.

## Features

### 🎵 Live Audio Player
- Real-time streaming from the ToolBox Radio stream
- Play/pause functionality with visual feedback
- Current show display with automatic updates
- Progress animation for visual appeal

### 📅 Show Schedule
- **The Breakfast Show**: 5:00 AM - 11:00 AM
- **Mid Day Madness**: 11:00 AM - 4:00 PM  
- **The Drive Home Show**: 4:00 PM - 8:00 PM
- **The Night Shift**: 8:00 PM - 5:00 AM

### 🎨 Modern Design
- iOS-style interface with glassmorphism effects
- Construction industry theming with tools and equipment icons
- Responsive design for all devices
- Smooth animations and transitions
- Mobile-friendly navigation

### 📢 Advertising & Sponsorship
- Dedicated section for advertising opportunities
- Information about show sponsorship
- Contact form for inquiries
- Reference to Deu Na Media for advertising applications

## Technical Details

### Audio Stream
- Stream URL: `https://radio.toolboxradio.com/listen/toolbox_radio/radio.mp3`
- HTML5 Audio API implementation
- Error handling for connection issues
- Automatic show detection based on current time

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality and audio handling
- **Font Awesome**: Icons for construction theme
- **Google Fonts**: Inter font family for modern typography

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## File Structure

```
ToolBox Radio/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **Click the play button** to start listening to ToolBox Radio
4. **Navigate** through the sections using the menu

## Features in Detail

### Audio Player
- Real-time streaming with the provided URL
- Visual feedback for play/pause states
- Current show display that updates automatically
- Progress bar animation
- Error handling for connection issues

### Responsive Design
- Mobile-first approach
- Collapsible navigation menu for mobile devices
- Flexible grid layouts that adapt to screen size
- Touch-friendly interface elements

### Interactive Elements
- Smooth scrolling navigation
- Hover effects on cards and buttons
- Ripple effects on button clicks
- Scroll-triggered animations
- Contact form with validation

### Construction Theme
- Tool icons (hammer, wrench, hard hat, truck, cog)
- Construction industry color scheme (orange, gold, blue)
- Professional yet approachable design
- Industry-specific content and messaging

## Customization

### Colors
The main color scheme can be modified in `styles.css`:
- Primary Orange: `#ff6b35`
- Gold Accent: `#ffd700`
- Blue Gradient: `#667eea` to `#764ba2`

### Audio Stream
To change the audio stream URL, update the constructor in `script.js`:
```javascript
this.audio = new Audio('YOUR_STREAM_URL_HERE');
```

### Show Schedule
Modify the shows array in `script.js` to update show times and names:
```javascript
this.shows = [
    { name: 'Show Name', start: startHour, end: endHour, icon: 'emoji' }
];
```

## Browser Compatibility

The website uses modern web technologies and is optimized for:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- Optimized CSS with efficient selectors
- Minimal JavaScript for fast loading
- Responsive images and icons
- Smooth animations using CSS transforms

## Contact Information

For advertising and sponsorship opportunities, contact **Deu Na Media**.

For technical support or general inquiries: `info@toolboxradio.com`

## License

This project is created for ToolBox Radio. All rights reserved.

---

**ToolBox Radio** - The Voice of the Construction Industry 🏗️🎵 