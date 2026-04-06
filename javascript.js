// Scroll Effects (continued)
function initScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .service-card, .about-box, .gallery-grid img').forEach(el => {
        observer.observe(el);
    });
}

// Stats Counter Animation
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const count = parseInt(stat.innerText);
            const increment = target / 100;
            
            if (count < target) {
                stat.innerText = Math.ceil(count + increment);
                setTimeout(animateStats, 20);
            } else {
                stat.innerText = target;
            }
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(document.querySelector('.hero-stats'));
}

// Populate Services Dynamically
function populateServices() {
    const container = document.getElementById('servicesGrid');
    servicesData.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.style.background = `linear-gradient(135deg, ${service.color}20, rgba(255,255,255,0.8))`;
        card.innerHTML = `
            <div class="service-icon" style="color: ${service.color};">${service.icon}</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <a href="#contact" class="service-link">
                Get Started <i class="fas fa-arrow-right"></i>
            </a>
        `;
        container.appendChild(card);
    });
}

// Gallery Functionality
let currentImageIndex = 0;
let visibleImages = 4;

function populateInitialGallery() {
    const container = document.getElementById('galleryGrid');
    galleryImages.slice(0, 4).forEach((image, index) => {
        const img = createGalleryImage(image.src, image.alt, index);
        container.appendChild(img);
    });
}

function createGalleryImage(src, alt, index) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'gallery-item';
    imgWrapper.innerHTML = `
        <div class="img-container">
            <img src="${src}" alt="${alt}" data-index="${index}">
            <div class="img-overlay">
                <div class="overlay-content">
                    <i class="fas fa-search-plus"></i>
                    <span>View Project</span>
                </div>
            </div>
        </div>
    `;
    
    imgWrapper.querySelector('img').addEventListener('click', () => openGalleryPopup(index));
    return imgWrapper;
}

function initGallery() {
    const popup = document.getElementById('imagePopup');
    const closeBtn = document.querySelector('.popup-close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const popupImg = document.getElementById('popupImage');
    const popupCounter = document.getElementById('popupCounter');

    // Close popup
    closeBtn.addEventListener('click', closeGalleryPopup);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closeGalleryPopup();
    });

    // Navigation
    prevBtn.addEventListener('click', () => changeGalleryImage(-1));
    nextBtn.addEventListener('click', () => changeGalleryImage(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (popup.classList.contains('active')) {
            switch(e.key) {
                case 'Escape': closeGalleryPopup(); break;
                case 'ArrowLeft': changeGalleryImage(-1); break;
                case 'ArrowRight': changeGalleryImage(1); break;
            }
        }
    });
}

function openGalleryPopup(index) {
    currentImageIndex = index;
    updateGalleryPopup();
    document.getElementById('imagePopup').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGalleryPopup() {
    document.getElementById('imagePopup').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeGalleryImage(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    updateGalleryPopup();
}

function updateGalleryPopup() {
    const popupImg = document.getElementById('popupImage');
    const popupCounter = document.getElementById('popupCounter');
    
    popupImg.src = galleryImages[currentImageIndex].src;
    popupImg.alt = galleryImages[currentImageIndex].alt;
    popupCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

// Load More Gallery Images
function initLoadMore() {
    const btn = document.getElementById('loadMoreBtn');
    btn.addEventListener('click', () => {
        const startIndex = visibleImages;
        const endIndex = Math.min(visibleImages + 3, galleryImages.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const img = createGalleryImage(
                galleryImages[i].src, 
                galleryImages[i].alt, 
                i
            );
            document.getElementById('galleryGrid').appendChild(img);
        }
        
        visibleImages = endIndex;
        if (visibleImages >= galleryImages.length) {
            btn.style.display = 'none';
        }
        
        // Animate new images
        const newImages = document.querySelectorAll('.gallery-item:last-child');
        newImages.forEach((img, index) => {
            setTimeout(() => img.classList.add('animate'), index * 100);
        });
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    const loader = document.getElementById('formLoader');
    const successMsg = document.getElementById('formSuccess');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        // Show loading
        button.disabled = true;
        loader.style.display = 'inline-block';
        button.querySelector('span').textContent = 'Sending...';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Reset form
            form.reset();
            
            // Show success
            successMsg.style.display = 'block';
            form.scrollIntoView({ behavior: 'smooth' });
            
            // Hide success after 5 seconds
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            alert('Oops! Something went wrong. Please try again.');
        } finally {
            // Reset button
            button.disabled = false;
            loader.style.display = 'none';
            button.innerHTML = originalText;
        }
    });
}

// Back to Top Button
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth"
            });
        }
        
        // Close mobile menu
        document.querySelector('.nav-links').classList.remove('active');
        document.querySelector('.mobile-menu-toggle').classList.remove('active');
    });
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const speed = scrolled * 0.5;
    hero.style.transform = `translateY(${speed}px)`;
});

// Initialize Load More after gallery setup
setTimeout(initLoadMore, 100);

// Preload images for smooth gallery
function preloadGalleryImages() {
    galleryImages.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
}
preloadGalleryImages();

// PWA Ready - Add to home screen prompt (optional)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
});

// Performance optimization
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}

console.log('🚀 EAO Creatives - Fully Loaded & Ready!');
</script>

</body>
</html>