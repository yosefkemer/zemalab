// Language switching functionality
let currentLanguage = 'en';

function toggleLanguage() {
    // Toggle between languages
    currentLanguage = currentLanguage === 'en' ? 'am' : 'en';
    
    // Add animation class
    const toggleBtn = event.target.closest('.lang-toggle-btn');
    toggleBtn.classList.add('switching');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        toggleBtn.classList.remove('switching');
    }, 300);
    
    // Apply language changes
    applyLanguage(currentLanguage);
    
    // Save language preference
    localStorage.setItem('preferred-language', currentLanguage);
}

function applyLanguage(lang) {
    if (lang === 'am') {
        document.documentElement.lang = 'am';
        document.body.setAttribute('lang', 'am');
        
        // Switch to Amharic text
        document.querySelectorAll('[data-am]').forEach(el => {
            el.textContent = el.getAttribute('data-am');
        });
        document.querySelectorAll('[data-am-placeholder]').forEach(el => {
            el.placeholder = el.getAttribute('data-am-placeholder');
        });
        
        // Update select options
        updateFormOptions('am');
        
    } else {
        document.documentElement.lang = 'en';
        document.body.removeAttribute('lang');
        
        // Restore English
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute('data-en');
        });
        document.querySelectorAll('[data-en-placeholder]').forEach(el => {
            el.placeholder = el.getAttribute('data-en-placeholder');
        });
        
        updateFormOptions('en');
    }
}

function updateFormOptions(lang) {
    const selectElements = document.querySelectorAll('select option');
    selectElements.forEach(option => {
        const translation = option.getAttribute('data-' + lang);
        if (translation) {
            option.textContent = translation;
        }
    });
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Always start with English as default, ignore saved language preference
    currentLanguage = 'en';
    
    // Ensure English is displayed (this is the default state)
    applyLanguage('en');
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Initialize navbar scroll effect
    initializeNavbarScroll();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize stats animation
    animateStats();
});

// Navbar scroll effect
function initializeNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Navigation functionality
function initializeNavigation() {
    // Active navigation link
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            console.log('Navigation clicked:', href);
            
            // Handle home navigation specifically
            if (href === '#home') {
                console.log('Navigating to home - scrolling to top');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                closeMobileMenu();
                return;
            }
            
            // Handle other sections
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                console.log('Scrolling to section:', href, 'at position:', offsetTop);
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                console.error('Target not found for:', href);
            }
            
            closeMobileMenu();
        });
    });
}

// Mobile menu functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        toggleBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
    } else {
        toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    
    mobileMenu.classList.remove('active');
    toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
}

// Modal functions
function openModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').setAttribute('min', today);
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});

// Form submission
function handleBookingSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Show appropriate message based on language
    const successMessage = currentLanguage === 'am' 
        ? 'የቀጠሮ ጥያቄዎት ላስገባቸዋት እናመሰግናለን! በ24 ሰዓት ውስጥ ቀጠሮዎን ለማረጋገጥ እናገኝዎታለን።'
        : 'Thank you for your appointment request! We will contact you within 24 hours to confirm your booking and provide any additional instructions.';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        alert(successMessage);
        closeModal();
        event.target.reset();
    }, 1000);
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const loadingText = currentLanguage === 'am' 
        ? '<i class="bi bi-hourglass-split me-2"></i>በመላክ ላይ...'
        : '<i class="bi bi-hourglass-split me-2"></i>Submitting...';
    
    submitBtn.innerHTML = loadingText;
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Stats animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent.replace(/[^\d]/g, '');
                const suffix = target.textContent.replace(/[\d]/g, '');
                
                let currentValue = 0;
                const increment = Math.ceil(finalValue / 50);

                const updateCount = () => {
                    currentValue += increment;
                    if (currentValue > finalValue) currentValue = finalValue;
                    target.textContent = currentValue + suffix;
                    if (currentValue < finalValue) {
                        requestAnimationFrame(updateCount);
                    }
                };
                updateCount();

                observer.unobserve(target);
            }
        });
    }, { threshold: 0.6 });

    statNumbers.forEach(stat => observer.observe(stat));
}

// Utility functions for form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Enhanced form validation
function validateBookingForm(formData) {
    const errors = [];
    
    // Required field validation
    if (!formData.get('fullName')?.trim()) {
        errors.push(currentLanguage === 'am' ? 'ሙሉ ስም ያስፈልጋል' : 'Full name is required');
    }
    
    if (!formData.get('email')?.trim()) {
        errors.push(currentLanguage === 'am' ? 'ኢሜይል አድራሻ ያስፈልጋል' : 'Email address is required');
    } else if (!validateEmail(formData.get('email'))) {
        errors.push(currentLanguage === 'am' ? 'ትክክለኛ ኢሜይል አድራሻ ያስገቡ' : 'Please enter a valid email address');
    }
    
    if (!formData.get('phone')?.trim()) {
        errors.push(currentLanguage === 'am' ? 'ስልክ ቁጥር ያስፈልጋል' : 'Phone number is required');
    } else if (!validatePhone(formData.get('phone'))) {
        errors.push(currentLanguage === 'am' ? 'ትክክለኛ ስልክ ቁጥር ያስገቡ' : 'Please enter a valid phone number');
    }
    
    if (!formData.get('testType')) {
        errors.push(currentLanguage === 'am' ? 'የምርመራ ዓይነት ይምረጡ' : 'Please select a test type');
    }
    
    if (!formData.get('collectionType')) {
        errors.push(currentLanguage === 'am' ? 'የመሰብሰብ ዘዴ ይምረጡ' : 'Please select a collection method');
    }
    
    if (!formData.get('preferredDate')) {
        errors.push(currentLanguage === 'am' ? 'የተመረጠ ቀን ይምረጡ' : 'Please select a preferred date');
    }
    
    return errors;
}

// Enhanced form submission with validation
function handleBookingSubmitEnhanced(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    
    // Validate form
    const errors = validateBookingForm(formData);
    
    if (errors.length > 0) {
        const errorMessage = errors.join('\n');
        alert(errorMessage);
        return;
    }
    
    // Continue with submission...
    handleBookingSubmit(event);
}

// Keyboard navigation support
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard support for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('bookingModal');
            if (modal && modal.classList.contains('active')) {
                closeModal();
            }
        }
    });
    
    // Add keyboard support for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
});

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button (optional enhancement)
function addScrollToTopButton() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-normal);
        z-index: 1000;
    `;
    
    scrollBtn.onclick = scrollToTop;
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
}

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll to top button
    addScrollToTopButton();
    
    // Initialize lazy loading if images have data-src attributes
    initializeLazyLoading();
    
    // Add loading animation to page
    document.body.classList.add('loaded');
});

// Service worker registration for offline capability (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Analytics tracking helper (replace with your analytics service)
function trackEvent(category, action, label) {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    // Example: Custom analytics
    console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function() {
            trackEvent('Form', 'Submit', 'Booking Form');
        });
    }
});

// Accessibility improvements
function improveAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if it doesn't exist
    const heroSection = document.getElementById('home');
    if (heroSection && !document.getElementById('main-content')) {
        heroSection.id = 'main-content';
    }
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveAccessibility);

// Export functions for testing or external use
window.ZemaLab = {
    toggleLanguage,
    openModal,
    closeModal,
    toggleMobileMenu,
    closeMobileMenu,
    handleBookingSubmit,
    trackEvent,
    scrollToTop
};