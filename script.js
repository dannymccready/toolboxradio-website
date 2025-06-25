// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        this.reset();
    });
}

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for animations
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
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .about-content, .promo-content, .contact-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (counter.textContent.includes('+')) {
                counter.textContent = Math.floor(current) + '+';
            } else if (counter.textContent.includes('/')) {
                counter.textContent = Math.floor(current) + '/7';
            } else if (counter.textContent.includes('%')) {
                counter.textContent = Math.floor(current) + '%';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Button click effects
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = e.target.getBoundingClientRect();
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
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Add ripple animation CSS
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

// Lazy loading for images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add loading state to forms
function setLoadingState(form, isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Send Message';
        }
    }
}

// Enhanced form submission with loading state
if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.dataset.originalText = submitBtn.innerHTML;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        setLoadingState(this, true);
        
        // Simulate API call
        setTimeout(() => {
            setLoadingState(this, false);
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        }, 2000);
    });
}

// Add scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #ed7519 0%, #de5a0f 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(237, 117, 25, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Function to open player in new window
function openPlayer() {
    // First check user location
    checkUserLocation().then(isAllowed => {
        if (isAllowed) {
            // User is in UK or Ireland - open the player
            const playerWindow = window.open(
                'player.html',
                'ToolBoxRadioPlayer',
                'width=500,height=175,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no'
            );
            
            // Focus the new window
            if (playerWindow) {
                playerWindow.focus();
            }
        } else {
            // User is not in UK or Ireland - show copyright message
            const copyrightWindow = window.open(
                '',
                'ToolBoxRadioPlayer',
                'width=400,height=200,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no'
            );
            
            if (copyrightWindow) {
                copyrightWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>ToolBox Radio - Region Restricted</title>
                        <style>
                            body {
                                font-family: 'Inter', sans-serif;
                                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                                color: white;
                                margin: 0;
                                padding: 20px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                min-height: 100vh;
                                text-align: center;
                            }
                            .message-container {
                                background: rgba(255, 255, 255, 0.1);
                                backdrop-filter: blur(10px);
                                border-radius: 16px;
                                padding: 30px;
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                max-width: 350px;
                            }
                            .icon {
                                font-size: 48px;
                                color: #fbbf24;
                                margin-bottom: 20px;
                            }
                            h2 {
                                font-size: 20px;
                                font-weight: 600;
                                margin-bottom: 15px;
                                color: #fbbf24;
                            }
                            p {
                                font-size: 14px;
                                line-height: 1.5;
                                color: rgba(255, 255, 255, 0.9);
                                margin-bottom: 20px;
                            }
                            .close-btn {
                                background: linear-gradient(135deg, #ed7519 0%, #de5a0f 100%);
                                color: white;
                                border: none;
                                padding: 10px 20px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-size: 14px;
                                font-weight: 600;
                                transition: all 0.3s ease;
                            }
                            .close-btn:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 4px 15px rgba(237, 117, 25, 0.4);
                            }
                        </style>
                    </head>
                    <body>
                        <div class="message-container">
                            <div class="icon">🌍</div>
                            <h2>Region Restricted</h2>
                            <p>We're sorry, but due to copyright and licensing restrictions, ToolBox Radio is only available in the United Kingdom and Ireland.</p>
                            <button class="close-btn" onclick="window.close()">Close Window</button>
                        </div>
                    </body>
                    </html>
                `);
                copyrightWindow.document.close();
                copyrightWindow.focus();
            }
        }
    }).catch(error => {
        console.error('Error checking location:', error);
        // If location check fails, show the copyright message to be safe
        const copyrightWindow = window.open(
            '',
            'ToolBoxRadioPlayer',
            'width=400,height=200,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no'
        );
        
        if (copyrightWindow) {
            copyrightWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>ToolBox Radio - Region Restricted</title>
                    <style>
                        body {
                            font-family: 'Inter', sans-serif;
                            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                            color: white;
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            text-align: center;
                        }
                        .message-container {
                            background: rgba(255, 255, 255, 0.1);
                            backdrop-filter: blur(10px);
                            border-radius: 16px;
                            padding: 30px;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            max-width: 350px;
                        }
                        .icon {
                            font-size: 48px;
                            color: #fbbf24;
                            margin-bottom: 20px;
                        }
                        h2 {
                            font-size: 20px;
                            font-weight: 600;
                            margin-bottom: 15px;
                            color: #fbbf24;
                        }
                        p {
                            font-size: 14px;
                            line-height: 1.5;
                            color: rgba(255, 255, 255, 0.9);
                            margin-bottom: 20px;
                        }
                        .close-btn {
                            background: linear-gradient(135deg, #ed7519 0%, #de5a0f 100%);
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 600;
                            transition: all 0.3s ease;
                        }
                        .close-btn:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 4px 15px rgba(237, 117, 25, 0.4);
                        }
                    </style>
                </head>
                <body>
                    <div class="message-container">
                        <div class="icon">🌍</div>
                        <h2>Region Restricted</h2>
                        <p>We're sorry, but due to copyright and licensing restrictions, ToolBox Radio is only available in the United Kingdom and Ireland.</p>
                        <button class="close-btn" onclick="window.close()">Close Window</button>
                    </div>
                </body>
                </html>
            `);
            copyrightWindow.document.close();
            copyrightWindow.focus();
        }
    });
}

// Function to check user location
async function checkUserLocation() {
    try {
        // Use a free geolocation API to get user's country
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Check if user is in UK or Ireland
        const allowedCountries = ['GB', 'IE']; // GB = United Kingdom, IE = Ireland
        return allowedCountries.includes(data.country_code);
        
    } catch (error) {
        console.error('Error fetching location:', error);
        // If the API fails, we'll show the copyright message to be safe
        return false;
    }
}

// Add hover effects for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

console.log('ToolBox Radio website loaded successfully! 🎵'); 