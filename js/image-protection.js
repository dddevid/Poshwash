/**
 * Image Protection Script
 * Prevents easy copying of testimonial profile images and gallery images
 * Enhanced anti-scraping protection
 */

document.addEventListener('DOMContentLoaded', function() {
    // Protect testimonial profile images
    protectTestimonialImages();
    
    // Protect gallery images
    protectGalleryImages();
    
    // Add global anti-scraping protection
    addGlobalProtection();
});

/**
 * Protects testimonial profile images from being copied or dragged
 */
function protectTestimonialImages() {
    const testimonialImages = document.querySelectorAll('.testimonial-image');
    
    testimonialImages.forEach(img => {
        // Prevent right-click
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Prevent drag
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Add CSS to prevent selection
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.style.msUserSelect = 'none';
        
        // Add a transparent overlay to make it harder to screenshot or inspect
        const parent = img.parentElement;
        parent.style.position = 'relative';
        
        const overlay = document.createElement('div');
        overlay.className = 'image-protection-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '1';
        overlay.style.pointerEvents = 'none';
        
        // Insert overlay after the image
        parent.insertBefore(overlay, img.nextSibling);
        
        // Obfuscate the image URL
        if (img.src) {
            // Store the original source
            img.setAttribute('data-original-src', img.src);
            
            // Create a blob URL to make it harder to get the original URL
            fetch(img.src)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    img.src = blobUrl;
                })
                .catch(error => {
                    console.error('Error creating blob URL:', error);
                });
        }
    });
}

/**
 * Protects gallery images from being copied or dragged
 */
function protectGalleryImages() {
    const galleryItems = document.querySelectorAll('.gallery-item img, .lightbox-img');
    
    galleryItems.forEach(img => {
        // Prevent right-click
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Prevent drag
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Add CSS to prevent selection
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.style.msUserSelect = 'none';
    });
    
    // Add protection to lightbox images when they're loaded
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        if (lightboxImg) {
            // Prevent right-click
            lightboxImg.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Prevent drag
            lightboxImg.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
        }
    }
    
    // Add CSS to disable saving images with keyboard shortcuts
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item img, .lightbox-img, .testimonial-image {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            pointer-events: none;
        }
        
        .gallery-item, .testimonial-card {
            position: relative;
            overflow: hidden;
        }
        
        .gallery-item::after, .testimonial-image::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Adds global anti-scraping protection to the entire website
 */
function addGlobalProtection() {
    // Prevent keyboard shortcuts for saving content
    document.addEventListener('keydown', function(e) {
        // Prevent Ctrl+S, Ctrl+P, Ctrl+Shift+I
        if ((e.ctrlKey && e.key === 's') || 
            (e.ctrlKey && e.key === 'p') || 
            (e.ctrlKey && e.shiftKey && e.key === 'i')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable text selection on the entire page
    document.body.style.userSelect = 'none';
    
    // Add invisible watermark to the page
    const watermark = document.createElement('div');
    watermark.style.position = 'fixed';
    watermark.style.top = '0';
    watermark.style.left = '0';
    watermark.style.width = '100%';
    watermark.style.height = '100%';
    watermark.style.zIndex = '-1';
    watermark.style.pointerEvents = 'none';
    watermark.style.opacity = '0.005';
    watermark.style.background = `url('data:text/plain;charset=utf-8,${encodeURIComponent("PoshWash ODI © " + new Date().getFullYear())}') repeat`;
    document.body.appendChild(watermark);
    
    // Detect and block headless browsers and automation tools
    if (navigator.webdriver || 
        navigator.userAgent.toLowerCase().includes('headless') ||
        /PhantomJS|SlimerJS|CasperJS/.test(navigator.userAgent)) {
        document.body.innerHTML = '<h1>Automated access is not allowed</h1>';
    }
}