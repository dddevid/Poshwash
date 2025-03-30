document.addEventListener('DOMContentLoaded', function() {
    // Function to convert text between asterisks to bold
    function convertAsterisksToBold() {
        // Get all elements that might contain text
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div.testimonial-text');
        
        textElements.forEach(element => {
            // Skip elements that shouldn't be processed
            if (element.classList.contains('info-tooltip') || element.tagName === 'SCRIPT') return;
            
            // Get the HTML content
            let html = element.innerHTML;
            
            // Replace text between asterisks with bold text, but only if there are matching pairs
            html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
            
            // Update the HTML content
            element.innerHTML = html;
        });
    }
    
    // Call the function to convert asterisks to bold
    convertAsterisksToBold();
    
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('header');
    let mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
        <div class="close-menu"></div>
        <ul>
            ${document.querySelector('nav ul').innerHTML}
        </ul>
    `;
    document.body.appendChild(mobileNav);

    // Toggle mobile menu and button state
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.add('active');
        mobileMenuBtn.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });

    document.querySelector('.close-menu').addEventListener('click', function() {
        mobileNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    });

    // Info tooltip positioning functionality
    const infoIcons = document.querySelectorAll('.info-icon');
    
    infoIcons.forEach(icon => {
        const tooltip = icon.querySelector('.info-tooltip');
        
        icon.addEventListener('mouseenter', function(e) {
            // Get the position of the info icon
            const iconRect = icon.getBoundingClientRect();
            
            // Position the tooltip above the icon
            tooltip.style.top = (window.scrollY + iconRect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (window.scrollX + iconRect.left + (iconRect.width / 2)) + 'px';
            
            // Show the tooltip by adding a class
            tooltip.classList.add('visible');
        });
        
        icon.addEventListener('mouseleave', function(e) {
            // Hide the tooltip when mouse leaves
            const tooltip = icon.querySelector('.info-tooltip');
            tooltip.classList.remove('visible');
        });
    });

    // Gallery and Lightbox functionality
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryImages = [
        'IMG-20250326-WA0001.jpg', 'IMG-20250326-WA0002.jpg', 'IMG-20250326-WA0003.jpg',
        'IMG-20250326-WA0004.jpg', 'IMG-20250326-WA0005.jpg', 'IMG-20250326-WA0006.jpg',
        'IMG-20250326-WA0007.jpg', 'IMG-20250326-WA0008.jpg', 'IMG-20250326-WA0009.jpg',
        'IMG-20250326-WA0010.jpg', 'IMG-20250326-WA0011.jpg', 'IMG-20250326-WA0012.jpg',
        'IMG-20250326-WA0013.jpg', 'IMG-20250326-WA0014.jpg', 'IMG-20250326-WA0015.jpg',
        'IMG-20250326-WA0016.jpg', 'IMG-20250326-WA0017.jpg', 'IMG-20250326-WA0018.jpg',
        'IMG-20250326-WA0019.jpg', 'IMG-20250326-WA0020.jpg', 'IMG-20250326-WA0021.jpg',
        'IMG-20250326-WA0022.jpg', 'IMG-20250326-WA0023.jpg', 'IMG-20250326-WA0024.jpg'
    ];
    
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="" alt="Enlarged gallery image" class="lightbox-img">
            <button class="lightbox-close">&times;</button>
            <div class="lightbox-nav">
                <button class="lightbox-prev">&lt;</button>
                <button class="lightbox-next">&gt;</button>
            </div>
            <div class="lightbox-counter">1 / ${galleryImages.length}</div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    
    let currentImageIndex = 0;
    
    // Populate gallery with images
    if (galleryGrid) {
        galleryImages.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="images/gallery/${image}" alt="Gallery image ${index + 1}">`;
            
            galleryItem.addEventListener('click', () => {
                currentImageIndex = index;
                updateLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
            });
            
            galleryGrid.appendChild(galleryItem);
        });
    }
    
    // Lightbox functionality
    function updateLightboxImage() {
        lightboxImg.src = `images/gallery/${galleryImages[currentImageIndex]}`;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
    
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    });
    
    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    });
    
    // Enhanced touch swipe functionality for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        // Calculate horizontal and vertical distance
        const horizontalDistance = touchEndX - touchStartX;
        const verticalDistance = touchEndY - touchStartY;
        
        // Only register as horizontal swipe if horizontal movement is greater than vertical
        if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
            // Detect swipe direction (minimum 30px movement to count as a swipe - reduced for better responsiveness)
            if (horizontalDistance < -30) {
                // Swipe left - go to next image
                lightboxNext.click();
            }
            if (horizontalDistance > 30) {
                // Swipe right - go to previous image
                lightboxPrev.click();
            }
        }
    }
    
    // Add swipe functionality to gallery grid for mobile users
    if (galleryGrid) {
        galleryGrid.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        galleryGrid.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleGallerySwipe();
        }, false);
    }
    
    function handleGallerySwipe() {
        // Calculate horizontal and vertical distance
        const horizontalDistance = touchEndX - touchStartX;
        const verticalDistance = touchEndY - touchStartY;
        
        // Only register as horizontal swipe if horizontal movement is greater than vertical
        if (Math.abs(horizontalDistance) > Math.abs(verticalDistance) && Math.abs(horizontalDistance) > 50) {
            // Scroll the gallery grid horizontally
            galleryGrid.scrollBy({
                left: -horizontalDistance * 2,
                behavior: 'smooth'
            });
        }
    }
    
    // Close lightbox with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        } else if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
            lightboxNext.click();
        }
    });
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Language switcher functionality
    const langBtns = document.querySelectorAll('.lang-btn');
    const elementsWithLang = document.querySelectorAll('[data-en][data-ga]');

    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Update active button
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update text content based on language
            elementsWithLang.forEach(el => {
                el.textContent = el.getAttribute(`data-${lang}`);
            });

            // Store language preference
            localStorage.setItem('poshwash-language', lang);
        });
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('poshwash-language');
    if (savedLang) {
        document.querySelector(`.lang-btn[data-lang="${savedLang}"]`).click();
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 154, 62, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(1, 190, 74, 0.1)';
            header.style.boxShadow = 'none';
        }
    });

    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Also update mobile nav active links
        document.querySelectorAll('.mobile-nav ul li a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const mailtoLink = `mailto:Kristjansokoli84@gmail.com?subject=${encodeURIComponent(formData.get('subject'))}&body=${encodeURIComponent('Name: ' + formData.get('name') + '\n\n' + formData.get('message'))}`;
            
            window.location.href = mailtoLink;
            
            // Show success message
            contactForm.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3 data-en="Email Client Opened!" data-ga="Cliant Ríomhphoist Oscailte!">Email Client Opened!</h3>
                    <p data-en="Please send the email from your email client to complete the process." data-ga="Seol an ríomhphost ó do chliant ríomhphoist chun an próiseas a chríochnú.">Please send the email from your email client to complete the process.</p>
                </div>
            `;
        });
    }

    // Initialize the map
    var map = L.map('mapid', {
        attributionControl: false  // Remove attribution control completely
    }).setView([53.2968834, -6.2108245], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ''  // Empty attribution text
    }).addTo(map);

    // Add a marker
    var marker = L.marker([53.2968834, -6.2108245]).addTo(map);
    marker.bindPopup("<b>PoshWash ODI</b><br>Sandyford IND Estate, D18TX38").openPopup();
});