/**
 * Image Protection Script
 * Previene il copia/incolla delle immagini nella galleria
 * Protezione anti-scraping migliorata
 */

document.addEventListener('DOMContentLoaded', function() {
    // Proteggi solo le immagini della galleria
    protectGalleryImages();
    
    // Aggiungi protezione anti-scraping con selezione testo abilitata
    addGlobalProtection();
});

/**
 * Protegge le immagini della galleria da copia e trascinamento
 */
function protectGalleryImages() {
    const galleryItems = document.querySelectorAll('.gallery-item img, .lightbox-img');
    
    galleryItems.forEach(img => {
        // Previeni click destro
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Previeni trascinamento
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Aggiungi CSS per prevenire la selezione SOLO per le immagini
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.style.msUserSelect = 'none';
        img.style.pointerEvents = 'none';
    });
    
    // Protezione per le immagini lightbox quando vengono caricate
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        if (lightboxImg) {
            // Previeni click destro
            lightboxImg.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Previeni trascinamento
            lightboxImg.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
        }
    }
    
    // Aggiungi CSS per disabilitare il salvataggio delle immagini con scorciatoie da tastiera
    // MA PERMETTI LA SELEZIONE DEL TESTO
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item img, .lightbox-img {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            pointer-events: none;
        }
        
        .gallery-item {
            position: relative;
            overflow: hidden;
        }
        
        .gallery-item::after {
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
 * Aggiunge protezione anti-scraping al sito web ma consente la selezione del testo
 */
function addGlobalProtection() {
    // Previeni le scorciatoie da tastiera per salvare i contenuti
    document.addEventListener('keydown', function(e) {
        // Previeni solo Ctrl+S, Ctrl+P, Ctrl+Shift+I
        // NON disabilita altre scorciatoie come copia/incolla
        if ((e.ctrlKey && e.key === 's') || 
            (e.ctrlKey && e.key === 'p') || 
            (e.ctrlKey && e.shiftKey && e.key === 'i')) {
            e.preventDefault();
            return false;
        }
    });
    
    // NON disabilitare la selezione del testo sull'intera pagina
    // document.body.style.userSelect = 'none'; <-- RIMOSSO
    
    // Aggiungi filigrana invisibile alla pagina
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
    
    // Rileva e blocca i browser headless e gli strumenti di automazione
    if (navigator.webdriver || 
        navigator.userAgent.toLowerCase().includes('headless') ||
        /PhantomJS|SlimerJS|CasperJS/.test(navigator.userAgent)) {
        document.body.innerHTML = '<h1>Automated access is not allowed</h1>';
    }
}
