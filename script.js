// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const playerStatus = document.getElementById('player-status');
const currentSong = document.getElementById('current-song');
const currentArtist = document.getElementById('current-artist');
const progressFill = document.getElementById('progress-fill');
const currentTime = document.getElementById('current-time');
const totalTime = document.getElementById('total-time');
const contactForm = document.getElementById('contact-form');
const geoRestriction = document.getElementById('geo-restriction');
const mainContent = document.getElementById('main-content');
const userLocation = document.getElementById('user-location');

// Player State
let isPlaying = false;
let currentVolume = 50;
let currentTrackIndex = 0;

// Sample playlist for demo
const playlist = [
    { title: "Work Hard, Play Hard", artist: "Construction Crew", duration: "3:45" },
    { title: "Concrete Dreams", artist: "The Builders", duration: "4:12" },
    { title: "Steel & Soul", artist: "Hard Hat Heroes", duration: "3:58" },
    { title: "Blueprint Blues", artist: "Site Workers", duration: "4:30" },
    { title: "Hammer Time", artist: "Tool Masters", duration: "3:22" },
    { title: "Foundation Funk", artist: "Concrete Kings", duration: "4:05" }
];

// Geolocation Functions
function checkLocation() {
    // Developer override: always show main content if ?dev=1 in URL
    if (window.location.search.includes('dev=1')) {
        showMainContent();
        userLocation.textContent = "Developer Override: All Regions Allowed";
        console.warn('ToolBox Radio: Developer override active, location check bypassed.');
        return;
    }
    userLocation.textContent = "Checking...";
    // Manual override check
    if (localStorage.getItem('toolbox_radio_region_override') === 'allowed') {
        showMainContent();
        userLocation.textContent = "Manual Override: UK/Ireland";
        return;
    }
    // Force IP-based geolocation for production (not localhost)
    if (!window.location.hostname.includes('localhost') && window.location.protocol !== 'file:') {
        console.log('ToolBox Radio: Using IP-based geolocation (production mode)');
        getCountryFromIP();
        return;
    }
    // Otherwise, try browser geolocation first
    if (navigator.geolocation) {
        console.log('ToolBox Radio: Trying browser geolocation...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('ToolBox Radio: Browser geolocation success', latitude, longitude);
                getCountryFromCoords(latitude, longitude);
            },
            (error) => {
                console.warn('ToolBox Radio: Browser geolocation error', error);
                // Fallback to IP-based geolocation
                getCountryFromIP();
            }
        );
    } else {
        // Fallback to IP-based geolocation
        console.log('ToolBox Radio: Browser geolocation not available, using IP-based geolocation');
        getCountryFromIP();
    }
}

function isAllowedCountry(country) {
    if (!country) return false;
    const allowed = [
        'united kingdom',
        'uk',
        'ireland',
        'republic of ireland'
    ];
    const lc = country.toLowerCase();
    return allowed.some(region => lc.includes(region));
}

function getCountryFromCoords(lat, lng) {
    // Using a free geocoding service to get country from coordinates
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
        .then(response => response.json())
        .then(data => {
            const country = data.countryName;
            const city = data.city || data.locality || 'Unknown';
            userLocation.textContent = `${city}, ${country}`;
            
            if (isAllowedCountry(country)) {
                showMainContent();
            } else {
                showGeoRestriction();
            }
        })
        .catch(error => {
            console.log("Geocoding error:", error);
            getCountryFromIP();
        });
}

function getCountryFromIP() {
    // Fallback to IP-based geolocation using ipapi.co (no API key required)
    console.log('ToolBox Radio: Fetching location from ipapi.co...');
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const country = data.country_name;
            const city = data.city || 'Unknown';
            userLocation.textContent = `${city}, ${country}`;
            console.log('ToolBox Radio: ipapi.co result:', data);
            if (isAllowedCountry(country)) {
                showMainContent();
            } else {
                showGeoRestriction();
            }
        })
        .catch(error => {
            console.warn('ToolBox Radio: ipapi.co error', error);
            // Try a second fallback
            getCountryFromIPInfo();
        });
}

function getCountryFromIPInfo() {
    // Second fallback to ipinfo.io
    console.log('ToolBox Radio: Fetching location from ipinfo.io...');
    fetch('https://ipinfo.io/json?token=demo') // Remove token or use your own for production
        .then(response => response.json())
        .then(data => {
            const country = data.country || '';
            const city = data.city || 'Unknown';
            // ipinfo.io returns country code, so map to full name
            let countryName = country;
            if (country === 'GB') countryName = 'United Kingdom';
            if (country === 'IE') countryName = 'Ireland';
            userLocation.textContent = `${city}, ${countryName}`;
            console.log('ToolBox Radio: ipinfo.io result:', data);
            if (isAllowedCountry(countryName)) {
                showMainContent();
            } else {
                showGeoRestriction(true); // true = show manual override
            }
        })
        .catch(error => {
            console.warn('ToolBox Radio: ipinfo.io error', error);
            userLocation.textContent = "Unknown Location (please enable location, disable VPN, or check your connection)";
            showGeoRestriction(true); // true = show manual override
        });
}

function showGeoRestriction(showOverride) {
    geoRestriction.style.display = 'flex';
    mainContent.style.display = 'none';
    // Show manual override button if requested
    let overrideBtn = document.getElementById('manual-override-btn');
    if (showOverride) {
        if (!overrideBtn) {
            overrideBtn = document.createElement('button');
            overrideBtn.className = 'btn btn-accent';
            overrideBtn.id = 'manual-override-btn';
            overrideBtn.innerHTML = '<i class="fas fa-unlock"></i> I am in the UK or Ireland';
            overrideBtn.onclick = function() {
                localStorage.setItem('toolbox_radio_region_override', 'allowed');
                showMainContent();
                userLocation.textContent = "Manual Override: UK/Ireland";
            };
            document.querySelector('.geo-actions').appendChild(overrideBtn);
        }
        overrideBtn.style.display = 'inline-block';
    } else if (overrideBtn) {
        overrideBtn.style.display = 'none';
    }
}

function showMainContent() {
    geoRestriction.style.display = 'none';
    mainContent.style.display = 'block';
    // Initialize the main content
    initializeMainContent();
}

function showContactInfo() {
    showNotification('Contact us at hello@toolboxradio.com or call 1-800-TOOLBOX for licensing inquiries.', 'info');
}

// Login Button Fix
function openDashboard(event) {
    event.preventDefault();
    const url = 'http://134.209.28.199/dashboard';
    window.open(url, '_blank');
}

// Initialize main content functionality
function initializeMainContent() {
    // Initialize all the existing functionality
    initializeNavigation();
    if (document.getElementById('play-btn')) {
        initializePlayer();
    }
    if (document.getElementById('contact-form')) {
        initializeForm();
    }
    if (document.getElementById('request-form')) {
        initializeRequestForm();
    }
    initializeAnimations();
}

function initializeNavigation() {
    // Navigation Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Add smooth scrolling to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function initializePlayer() {
    // Initialize player
    updateTrackInfo();
}

function initializeForm() {
    // Form Handling
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

function initializeRequestForm() {
    const reqForm = document.getElementById('request-form');
    if (reqForm) {
        reqForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your request! We will try to play your song or shoutout soon.');
            this.reset();
        });
    }
}

function initializeAnimations() {
    // Set initial states for animations
    const elements = document.querySelectorAll('.feature-card, .contact-item, .player-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger initial animation check
    animateOnScroll();
}

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Player Controls
function togglePlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playIcon.className = 'fas fa-pause';
        playerStatus.textContent = 'Live';
        playerStatus.style.background = '#27ae60';
        startPlayerSimulation();
    } else {
        playIcon.className = 'fas fa-play';
        playerStatus.textContent = 'Paused';
        playerStatus.style.background = '#e74c3c';
        stopPlayerSimulation();
    }
}

function adjustVolume(direction) {
    if (direction === 'up' && currentVolume < 100) {
        currentVolume += 10;
    } else if (direction === 'down' && currentVolume > 0) {
        currentVolume -= 10;
    }
    
    // Update volume display (you could add a volume indicator here)
    console.log(`Volume: ${currentVolume}%`);
}

// Simulate player functionality
let playerInterval;
let progressInterval;

function startPlayerSimulation() {
    // Simulate track changes
    playerInterval = setInterval(() => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        updateTrackInfo();
    }, 30000); // Change track every 30 seconds
    
    // Simulate progress bar
    progressInterval = setInterval(() => {
        const progress = Math.random() * 100;
        progressFill.style.width = `${progress}%`;
        
        // Update time display
        const currentSeconds = Math.floor((progress / 100) * 225); // Assuming 3:45 track
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopPlayerSimulation() {
    clearInterval(playerInterval);
    clearInterval(progressInterval);
}

function updateTrackInfo() {
    const track = playlist[currentTrackIndex];
    currentSong.textContent = track.title;
    currentArtist.textContent = track.artist;
    totalTime.textContent = track.duration;
    
    // Reset progress
    progressFill.style.width = '0%';
    currentTime.textContent = '0:00';
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .contact-item, .player-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else if (navbar) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Utility functions
function togglePlayer() {
    scrollToSection('player');
    setTimeout(() => {
        togglePlay();
    }, 500);
}

// Add some interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn, .control-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add loading animation for the page
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Set initial body opacity
document.body.style.opacity = '0';

// Add some construction-themed easter eggs
let clickCount = 0;
const logo = document.querySelector('.nav-logo');

if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            showNotification('🏗️ Construction workers unite! You found the secret! 🏗️', 'success');
            clickCount = 0;
        }
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlay();
    }
    
    if (e.code === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        adjustVolume('up');
    }
    
    if (e.code === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        adjustVolume('down');
    }
});

// Add tooltip for keyboard shortcuts
const playButton = document.getElementById('play-btn');
if (playButton) {
    playButton.title = 'Press Spacebar to play/pause';
}

// Add some dynamic content updates
setInterval(() => {
    if (isPlaying) {
        // Simulate live listener count
        const listenerCount = Math.floor(Math.random() * 1000) + 500;
        const statusElement = document.querySelector('.status');
        if (statusElement) {
            statusElement.textContent = `Live • ${listenerCount} listeners`;
        }
    }
}, 10000);

// Add construction sound effects (optional)
function playConstructionSound() {
    // This would integrate with actual audio files
    console.log('🔨 Construction sounds playing!');
}

// Add this to the play button for extra effect
if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (!isPlaying) {
            playConstructionSound();
        }
    });
}

// Start geolocation check when page loads
document.addEventListener('DOMContentLoaded', () => {
    checkLocation();
}); 