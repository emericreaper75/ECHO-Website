// ============================================
// NAVIGATION
// ============================================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
}

// ============================================
// HERO SLIDESHOW
// ============================================

const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.slide-indicator');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    indicators.forEach(i => i.classList.remove('active'));

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 4000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

// Click indicators to jump to slide
indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        stopSlideshow();
        goToSlide(parseInt(indicator.getAttribute('data-slide')));
        startSlideshow();
    });
});

// Start auto-cycling
if (slides.length > 0) {
    startSlideshow();
}

// ============================================
// HIGHLIGHTS CAROUSEL
// ============================================

const highlightsTrack = document.getElementById('highlightsTrack');
const prevBtn = document.getElementById('highlightsPrev');
const nextBtn = document.getElementById('highlightsNext');
let carouselPosition = 0;

function getCardWidth() {
    const card = highlightsTrack ? highlightsTrack.querySelector('.highlight-card') : null;
    if (!card) return 320;
    const style = getComputedStyle(card);
    return card.offsetWidth + parseInt(style.marginRight || 0) + 24; // 24 = gap
}

function getMaxScroll() {
    if (!highlightsTrack) return 0;
    const wrapper = highlightsTrack.parentElement;
    return Math.max(0, highlightsTrack.scrollWidth - wrapper.offsetWidth);
}

function scrollCarousel(direction) {
    const cardWidth = getCardWidth();
    const maxScroll = getMaxScroll();

    carouselPosition += direction * cardWidth;
    if (carouselPosition < 0) carouselPosition = 0;
    if (carouselPosition > maxScroll) carouselPosition = 0; // wrap around

    highlightsTrack.style.transform = `translateX(-${carouselPosition}px)`;
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollCarousel(-1));
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollCarousel(1));
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card, .highlight-card, .overview-link-box, .happening-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
}

const statsSection = document.querySelector('.stats');
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statNumbers.forEach(stat => animateCounter(stat));
            statsAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// LOADING ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);
});

// ============================================
// NOTIFICATION CENTER TABS (legacy support)
// ============================================

const ncTabs = document.querySelectorAll('.nc-tab');
const ncContents = document.querySelectorAll('.nc-content');

ncTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        ncTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        ncContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.style.display = 'block';
            targetContent.classList.add('active');
        }
    });
});

console.log('🚀 ECHO Club website loaded successfully!');
