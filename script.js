// Device Detection and Mobile Layout
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

function initMobileLayout() {
    const body = document.body;
    
    // Create iPhone app-style mobile layout
    body.innerHTML = `
        <!-- Loading Screen for Mobile -->
        <div class="app-loading-screen" id="appLoadingScreen">
            <div class="app-loading-content">
                <div class="app-logo-container">
                    <img src="images/logo1.png" alt="ToolBox Radio" class="app-logo-loading">
                    <div class="loading-pulse"></div>
                </div>
                <h2>ToolBox Radio</h2>
                <p>Loading...</p>
            </div>
        </div>

        <!-- Simple Mobile Layout -->
        <div class="mobile-app-container">
            <!-- Top Header with Logo and Rotating Text -->
            <div class="mobile-header">
                <div class="header-logo">
                    <img src="images/logo1.png" alt="ToolBox Radio" class="header-logo-image">
                </div>
                <div class="header-text">
                    <div class="station-name">ToolBox Radio</div>
                    <div class="rotating-phrase" id="rotatingPhrase">Construction's #1 Music Station</div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="mobile-content-center">
                <!-- Album Art Display -->
                <div class="mobile-album-display">
                    <div class="mobile-album-cover">
                        <img src="https://i.scdn.co/image/ab67616d0000b273503c2b1acabdd3ad6650db82" alt="Album Art" class="album-cover-image" id="albumCoverImage">
                    </div>
                </div>
                
                <!-- Now Playing Information -->
                <div class="mobile-track-display">
                    <div class="now-playing-text">Now Playing</div>
                    <h2 class="mobile-track-name" id="mobileTrackName">Construction Rock Classics</h2>
                    <p class="mobile-artist-name" id="mobileArtistName">Various Artists</p>
                </div>
                
                <!-- Audio Player -->
                <audio id="mobileRadioPlayer" preload="none">
                    <source src="https://radio.toolboxradio.com/radio/8000/radio.mp3" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                
                <!-- Player Controls -->
                <div class="mobile-player-controls">
                    <button class="mobile-control-btn mobile-play-pause-btn" id="mobilePlayPauseBtn">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                
                <!-- Live Indicator -->
                <div class="mobile-live-indicator">
                    <div class="mobile-live-dot"></div>
                    <span>LIVE NOW</span>
                </div>
            </div>
        </div>
    `;
    
    // Hide loading screen and initialize
    setTimeout(() => {
        const loadingScreen = document.getElementById('appLoadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                initAppPlayer();
                startMobileTrackRotation();
                startHeaderPhraseRotation();
            }, 500);
        }
    }, 2500);
}

// Mobile App Player Controls
function initAppPlayer() {
    const audioPlayer = document.getElementById('mobileRadioPlayer');
    const playPauseBtn = document.getElementById('mobilePlayPauseBtn');
    let isPlaying = false;
    
    if (audioPlayer && playPauseBtn) {
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (!isPlaying) {
                // Start playing
                audioPlayer.play().then(() => {
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playPauseBtn.classList.add('playing');
                    isPlaying = true;
                }).catch(error => {
                    console.log('Playback failed:', error);
                    showAppMessage('Tap to allow audio playback');
                });
            } else {
                // Pause
                audioPlayer.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('playing');
                isPlaying = false;
            }
        });
        
        // Audio event listeners
        audioPlayer.addEventListener('loadstart', () => {
            console.log('Started loading radio stream...');
        });
        
        audioPlayer.addEventListener('canplay', () => {
            console.log('Radio stream ready to play');
        });
        
        audioPlayer.addEventListener('error', (e) => {
            console.log('Audio error:', e);
            showAppMessage('Connection error - please try again');
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.classList.remove('playing');
            isPlaying = false;
        });
        
        // Touch feedback
        playPauseBtn.addEventListener('touchstart', () => {
            playPauseBtn.style.transform = 'scale(0.95)';
        });
        
        playPauseBtn.addEventListener('touchend', () => {
            playPauseBtn.style.transform = 'scale(1)';
        });
    }
}

// Header phrase rotation
function startHeaderPhraseRotation() {
    const rotatingPhrase = document.getElementById('rotatingPhrase');
    
    if (!rotatingPhrase) {
        console.log('Rotating phrase element not found');
        return;
    }
    
    const phrases = [
        "Construction's #1 Music Station",
        "Non-Stop Construction Music",
        "Sod the Chat - Just the Tunes",
        "24/7 Live Construction Radio",
        "Powered by CMS Desk",
        "Worksite Radio for Professionals",
        "High Quality Audio Stream",
        "No Chat, Just Tunes"
    ];
    
    let phraseIndex = 0;
    
    setInterval(() => {
        // Fade out
        rotatingPhrase.style.opacity = '0.3';
        
        setTimeout(() => {
            // Update content
            rotatingPhrase.textContent = phrases[phraseIndex];
            
            // Fade in
            rotatingPhrase.style.opacity = '1';
        }, 300);
        
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }, 4000);
}

// Mobile track information rotation with album art
function startMobileTrackRotation() {
    const trackName = document.getElementById('mobileTrackName');
    const artistName = document.getElementById('mobileArtistName');
    const albumCoverImage = document.getElementById('albumCoverImage');
    
    if (!trackName || !artistName || !albumCoverImage) {
        console.log('Track elements not found');
        return;
    }
    
    const trackInfo = [
        { 
            track: "Thunder Road", 
            artist: "Bruce Springsteen",
            albumArt: "https://i.scdn.co/image/ab67616d0000b273503c2b1acabdd3ad6650db82"
        },
        { 
            track: "Working Man", 
            artist: "Rush",
            albumArt: "https://i.scdn.co/image/ab67616d0000b2738fe0cd8301a5e9a38b50b776"
        },
        { 
            track: "Hammer to Fall", 
            artist: "Queen",
            albumArt: "https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a"
        },
        { 
            track: "Working Class Hero", 
            artist: "John Lennon",
            albumArt: "https://i.scdn.co/image/ab67616d0000b273c53d01f4549b35bb7ba67f8e"
        },
        { 
            track: "Takin' Care of Business", 
            artist: "Bachman-Turner Overdrive",
            albumArt: "https://i.scdn.co/image/ab67616d0000b273d6038452b0c7b83940d8d76f"
        },
        { 
            track: "Blue Collar Man", 
            artist: "Styx",
            albumArt: "https://i.scdn.co/image/ab67616d0000b273a9ac0521e0b38851c51d29c6"
        },
        { 
            track: "Iron Man", 
            artist: "Black Sabbath",
            albumArt: "https://i.scdn.co/image/ab67616d0000b273c6c4d513f978d6900a8d490b"
        },
        { 
            track: "Welcome to the Machine", 
            artist: "Pink Floyd",
            albumArt: "https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe"
        }
    ];
    
    let index = 0;
    
    // Function to update album art
    function updateAlbumArt(artUrl, fallbackUrl = 'images/logo1.png') {
        // Add loading class
        albumCoverImage.classList.add('loading');
        
        const img = new Image();
        img.onload = function() {
            albumCoverImage.src = artUrl;
            albumCoverImage.classList.remove('loading');
        };
        img.onerror = function() {
            console.log('Failed to load album art:', artUrl, 'Using fallback:', fallbackUrl);
            albumCoverImage.src = fallbackUrl;
            albumCoverImage.classList.remove('loading');
        };
        img.src = artUrl;
    }
    
    setInterval(() => {
        const info = trackInfo[index];
        
        // Fade out
        trackName.style.opacity = '0.3';
        artistName.style.opacity = '0.3';
        albumCoverImage.style.opacity = '0.3';
        
        setTimeout(() => {
            // Update content
            trackName.textContent = info.track;
            artistName.textContent = info.artist;
            updateAlbumArt(info.albumArt);
            
            // Fade in
            trackName.style.opacity = '1';
            artistName.style.opacity = '1';
            albumCoverImage.style.opacity = '1';
        }, 400);
        
        index = (index + 1) % trackInfo.length;
    }, 6000);
    
    // Initialize with first track
    const firstTrack = trackInfo[0];
    updateAlbumArt(firstTrack.albumArt);
}

// Function to fetch album art from external sources
async function fetchAlbumArt(track, artist) {
    try {
        // Try to fetch from iTunes API
        const itunesResponse = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(track + ' ' + artist)}&media=music&limit=1`);
        const itunesData = await itunesResponse.json();
        
        if (itunesData.results && itunesData.results.length > 0) {
            const artwork = itunesData.results[0].artworkUrl100;
            if (artwork) {
                // Convert to higher resolution
                return artwork.replace('100x100', '600x600');
            }
        }
    } catch (error) {
        console.log('Failed to fetch from iTunes API:', error);
    }
    
    // Fallback to ToolBox Radio logo
    return 'images/logo1.png';
}

// Show helper message for app users
function showAppMessage(message) {
    const existingMessage = document.querySelector('.stream-helper-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'stream-helper-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
        z-index: 10001;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Add animation styles if not already added
    if (!document.getElementById('helper-message-styles')) {
        const style = document.createElement('style');
        style.id = 'helper-message-styles';
        style.textContent = `
            @keyframes slideDown {
                0% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Iframe Player Integration
class ToolBoxRadioPlayer {
    constructor() {
        this.iframe = document.querySelector('.iframe-container iframe, #radioStream');
        this.isMobile = isMobileDevice();
        this.init();
    }
    
    init() {
        // Add any iframe-specific functionality here
        console.log('ToolBox Radio iframe player initialized for', this.isMobile ? 'mobile' : 'desktop');
        
        // Optional: Add event listeners for iframe communication
        window.addEventListener('message', (event) => {
            // Handle messages from the iframe if needed
            if (event.origin === 'https://radio.toolboxradio.com') {
                console.log('Message from radio iframe:', event.data);
                
                // If mobile, try to sync custom player state with iframe
                if (this.isMobile) {
                    this.syncMobilePlayerState(event.data);
                }
            }
        });
        
        // Mobile-specific iframe optimizations
        if (this.isMobile && this.iframe) {
            this.iframe.style.touchAction = 'manipulation';
            this.iframe.setAttribute('allow', 'autoplay');
            
            // Ensure iframe is properly hidden initially
            setTimeout(() => {
                this.iframe.style.width = '1px';
                this.iframe.style.height = '1px';
                this.iframe.style.opacity = '0';
                this.iframe.style.pointerEvents = 'none';
            }, 100);
        }
    }
    
    syncMobilePlayerState(data) {
        const playBtn = document.getElementById('mobilePlayBtn');
        if (playBtn && data) {
            // Try to sync play/pause state based on iframe messages
            if (data.includes('play') || data.includes('start')) {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.classList.add('playing');
            } else if (data.includes('pause') || data.includes('stop')) {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.classList.remove('playing');
            }
        }
    }
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const topic = form.querySelector('#topic').value;
            const message = form.querySelector('#message').value;
            
            // Simple validation
            if (!name || !email || !message || topic === '') {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('span').textContent;
            const originalIcon = submitBtn.querySelector('i').className;
            
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.querySelector('i').className = originalIcon;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                border-left: 4px solid var(--primary);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #10b981;
            }
            
            .notification-error {
                border-left-color: #ef4444;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-content i {
                font-size: 1.25rem;
            }
            
            .notification-success .notification-content i {
                color: #10b981;
            }
            
            .notification-error .notification-content i {
                color: #ef4444;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .notification-close:hover {
                background: #f3f4f6;
                color: #6b7280;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .stat-card, .contact-card, .benefit-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Add mobile navigation styles
function addMobileNavStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(style);
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const particles = document.querySelectorAll('.particle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.1;
            particle.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if mobile device and initialize appropriate layout
    if (isMobileDevice()) {
        initMobileLayout();
        // Only initialize basic player functionality for mobile
        setTimeout(() => {
            const player = new ToolBoxRadioPlayer();
        }, 2500);
    } else {
        // Initialize the radio player
        const player = new ToolBoxRadioPlayer();
        
        // Initialize other features
        initLoadingScreen();
        initSmoothScrolling();
        initContactForm();
        initScrollAnimations();
        addMobileNavStyles();
        initMobileNav();
        initNavbarScroll();
        initParallaxEffect();
        
        // Add some interactive features
        addInteractiveFeatures();
    }
});

// Additional interactive features
function addInteractiveFeatures() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('button, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple effect styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        button, .cta-button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Add floating animation to stats
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach((stat, index) => {
        stat.style.animationDelay = `${index * 0.2}s`;
        stat.style.animation = 'float 3s ease-in-out infinite';
    });
    
    // Add floating animation styles
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(floatStyle);
}

// Add a simple loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loading animation styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadingStyle);
}); 