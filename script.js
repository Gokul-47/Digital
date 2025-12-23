// ============================================
// NAVIGATION & ROUTING
// ============================================

// Handle page routing - redirect to 404 if page doesn't exist
document.addEventListener('DOMContentLoaded', function() {
    const validPages = ['index.html', 'home2.html', '404.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    function navigateWithPreloader(target) {
        const preloader = document.getElementById('preloader');
        try { sessionStorage.setItem('preloaderOnNav', '1'); } catch (e) { /* ignore */ }
        if (preloader) preloader.classList.remove('preloader-hidden');
        // small delay so spinner is visible before navigation
        setTimeout(() => { window.location.href = target; }, 120);
    }

    // If page is invalid, go to 404 using preloader
    if (!validPages.includes(currentPage) && currentPage !== '') {
        navigateWithPreloader('404.html');
        return;
    }

    // If we arrived here via a navigation that used the preloader, show it briefly then hide
    if (sessionStorage.getItem('preloaderOnNav') === '1') {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.remove('preloader-hidden');
            setTimeout(() => {
                preloader.classList.add('preloader-hidden');
                try { sessionStorage.removeItem('preloaderOnNav'); } catch(e) {}
            }, 400);
        } else {
            try { sessionStorage.removeItem('preloaderOnNav'); } catch(e) {}
        }
    }

    // Handle navigation links with data-page attribute (use preloader on navigation)
    const navLinks = document.querySelectorAll('[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            let target = '404.html';
            if (page === 'home' || page === 'index') {
                target = 'index.html';
            } else if (page === 'home2') {
                target = 'home2.html';
            }
            navigateWithPreloader(target);
        });
    });

    // Handle service links
    const serviceLinks = document.querySelectorAll('.service-link[data-page]');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateWithPreloader('404.html');
        });
    });

    // Handle portfolio links
    const portfolioLinks = document.querySelectorAll('.portfolio-link[data-page]');
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateWithPreloader('404.html');
        });
    });

    // Handle footer links
    const footerLinks = document.querySelectorAll('.footer-col a[data-page]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            let target = '404.html';
            if (page === 'home' || page === 'index') {
                target = 'index.html';
            } else if (page === 'home2') {
                target = 'home2.html';
            }
            navigateWithPreloader(target);
        });
    });

    // Global handler for anchor links that are internal and not handled above
    document.addEventListener('click', function(e) {
        const a = e.target.closest('a');
        if (!a) return;
        if (e.defaultPrevented) return; // already handled
        if (a.hasAttribute('data-page')) return; // handled above
        if (a.target && a.target === '_blank') return; // external/new tab
        const href = a.getAttribute('href');
        if (!href) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        try {
            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return; // external
            const target = url.pathname.split('/').pop() || url.href;
            e.preventDefault();
            navigateWithPreloader(target);
        } catch (err) {
            // invalid URL, ignore
        }
    });
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Handle dropdown on mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!navList.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navList.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Observe stat numbers and animate when visible
const statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            entry.target.classList.add('counted');
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });

    // Also observe stat-value elements (for Home 2)
    const statValues = document.querySelectorAll('.stat-value[data-target]');
    statValues.forEach(stat => {
        statObserver.observe(stat);
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// PARALLAX EFFECT FOR HERO SECTION
// ============================================
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroShapes = document.querySelectorAll('.shape');
    
    heroShapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// ============================================
// CARD HOVER EFFECTS ENHANCEMENT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
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
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// ============================================
// TESTIMONIAL SLIDER (if multiple testimonials)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length > 1) {
        let currentIndex = 0;
        
        function showTestimonial(index) {
            testimonialCards.forEach((card, i) => {
                card.classList.remove('active');
                if (i === index) {
                    card.classList.add('active');
                }
            });
        }
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            showTestimonial(currentIndex);
        }, 5000);
        
        showTestimonial(0);
    }
});

// ============================================
// ENHANCED SCROLL INDICATOR
// ============================================
window.addEventListener('scroll', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ============================================
// PRELOADER & REDIRECT (defaults: redirect to home2.html)
// Logic: only redirect on first external visit per session
// ============================================
(function() {
    const preloader = document.getElementById('preloader');
    const redirectTo = 'home2.html';
    const showMs = 800; // milliseconds to show after load
    const sessionKey = 'preloaderRedirected';

    function shouldRedirect(currentPage) {
        // Don't redirect if we've already redirected this session
        if (sessionStorage.getItem(sessionKey) === '1') return false;

        // If referrer is from same origin, assume internal navigation -> don't redirect
        try {
            const ref = document.referrer;
            if (ref) {
                const refUrl = new URL(ref);
                if (refUrl.origin === window.location.origin) return false;
            }
        } catch (e) {
            /* ignore */
        }

        // Only redirect if current page isn't the target
        return currentPage !== redirectTo;
    }

    function finish() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (preloader) {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.remove();
                if (shouldRedirect(currentPage)) {
                    sessionStorage.setItem(sessionKey, '1');
                    window.location.href = redirectTo;
                }
            }, 300);
        } else {
            if (shouldRedirect(currentPage)) {
                sessionStorage.setItem(sessionKey, '1');
                window.location.href = redirectTo;
            }
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(finish, showMs);
    } else {
        window.addEventListener('load', function() {
            setTimeout(finish, showMs);
        });
    }
})();

