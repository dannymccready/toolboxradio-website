# Toolbox Radio - Mobile Website

A simple, responsive static website for Toolbox Radio designed specifically for mobile devices.

## Features

- **Mobile-first design** - Optimized for mobile devices with responsive layout
- **Clean, modern UI** - Beautiful gradient background with glassmorphism effects
- **Embedded radio player** - Direct integration with Toolbox Radio's streaming service
- **Fast loading** - Static HTML/CSS for optimal performance
- **Cross-platform** - Works on all modern browsers and devices

## Files

- `index.html` - Main HTML file with the website structure
- `styles.css` - CSS styles with responsive design and animations
- `README.md` - This documentation file

## How to Use

1. **Local Development**: Simply open `index.html` in any web browser
2. **Web Hosting**: Upload all files to any web hosting service (Netlify, Vercel, GitHub Pages, etc.)
3. **Mobile Testing**: Use browser developer tools to test mobile responsiveness

## Customization

### Changing the Logo
Edit the `<h1 class="logo">Toolbox Radio</h1>` text in `index.html` to change the logo text.

### Changing Colors
Modify the CSS variables in `styles.css`:
- Background gradient: Change the `background` property in the `body` selector
- Text colors: Modify the `color` properties in `.logo` and `.logo-subtitle`

### Adding a Logo Image
To use an actual logo image instead of text, replace the `<h1>` element with:
```html
<img src="path/to/your/logo.png" alt="Toolbox Radio" class="logo-image">
```

And add corresponding CSS:
```css
.logo-image {
    max-width: 200px;
    height: auto;
}
```

## Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Netlify (Recommended)
1. Drag and drop the folder to [netlify.com](https://netlify.com)
2. Your site will be live instantly

### GitHub Pages
1. Create a new repository
2. Upload the files
3. Enable GitHub Pages in repository settings

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory

## License

This project is open source and available under the MIT License. 