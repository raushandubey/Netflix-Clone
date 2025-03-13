// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const rowPosters = document.querySelectorAll('.row-posters');
const leftArrows = document.querySelectorAll('.left-arrow');
const rightArrows = document.querySelectorAll('.right-arrow');
const banner = document.getElementById('banner');
const overlay = document.getElementById('overlay');
const moviePreview = document.getElementById('movie-preview');
const previewClose = document.querySelector('.preview-close');
const posterContainers = document.querySelectorAll('.row-poster-container');
const navProfile = document.querySelector('.nav-profile');

// Netflix banner data
const bannerData = [
    {
        title: "Stranger Things",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl with extraordinary powers.",
        image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQjang2tSfHU_olHQ-m_gzuGMDV-h1wMsAsoagx_ho5GW2KksCy",
        match: "98%",
        year: "2022",
        seasons: "4 Seasons",
        classification: "TV-14",
        resolution: "HD"
    },
    {
        title: "The Witcher",
        description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
        image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTNNGFmvY5-pDEUVEDTBrAORhP8GZ85OCNX69Q0ILjY8gRnc_Bq",
        match: "96%",
        year: "2021",
        seasons: "2 Seasons",
        classification: "TV-MA",
        resolution: "HD"
    },
    {
        title: "Squid Game",
        description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
        image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRtMsLxGCVxmmql_aW_5XGGPDbGkC-63TGO1AFXDGEkDhrkVt1L",
        match: "97%",
        year: "2021",
        seasons: "1 Season",
        classification: "TV-MA",
        resolution: "HD"
    }
];

// Initialize netflix banner
let currentBannerIndex = 0;

// Create and cache the placeholder image
let placeholderImageCache;

/**
 * Generates a placeholder image for when movie posters fail to load
 * @returns {String} Data URL of the placeholder image
 */
function generatePlaceholderImage() {
    // Return cached version if exists
    if (placeholderImageCache) {
        return placeholderImageCache;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 300;
    
    // Background
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Netflix logo
    ctx.fillStyle = '#E50914';
    ctx.font = 'bold 70px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', canvas.width/2, canvas.height/2 - 30);
    
    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.fillText('Image Not Found', canvas.width/2, canvas.height/2 + 30);
    
    // Cache the result
    placeholderImageCache = canvas.toDataURL('image/png');
    return placeholderImageCache;
}

/**
 * Generates a placeholder image specifically for banner backgrounds
 * @returns {String} CSS value for background image with gradient fallback
 */
function generateBannerPlaceholder() {
    return `linear-gradient(77deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.8) 100%), 
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23141414'/><text x='100' y='100' font-family='Arial' font-size='30' fill='%23E50914' text-anchor='middle'>NETFLIX</text></svg>")`;
}

// Apply fallback to all images
document.addEventListener('DOMContentLoaded', () => {
    // Initialize banner
    updateBanner();
    
    // Apply fallback handler to all poster images
    const allPosters = document.querySelectorAll('.row-poster');
    allPosters.forEach(poster => {
        if (!poster.getAttribute('data-error-handled')) {
            poster.setAttribute('data-error-handled', 'true');
            
            // Store original src for potential retries
            const originalSrc = poster.src;
            
            // Create and preload the image to test if it loads
            const img = new Image();
            img.onload = function() {
                // Image loaded successfully, use the original source
                poster.src = originalSrc;
            };
            
            img.onerror = function() {
                // Try local placeholder first
                tryLocalPlaceholder(poster, originalSrc);
            };
            
            // Start loading the test image
            img.src = originalSrc;
        }
    });
    
    // Apply fallback for Netflix logo
    const netflixLogo = document.querySelector('.logo');
    if (netflixLogo && !netflixLogo.getAttribute('data-error-handled')) {
        netflixLogo.setAttribute('data-error-handled', 'true');
        const originalLogoSrc = netflixLogo.src;
        
        netflixLogo.onerror = function() {
            // Try the fallback URL specified in the HTML
            if (this.src !== 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png') {
                this.src = 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png';
            } else {
                // If fallback also fails, create an SVG logo
                const svgLogo = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 82" width="92"><path d="M0,0 L60,0 L60,82 L0,82 L0,0 Z" fill="%23E50914"/><path d="M78,0 L300,0 L300,82 L78,82 L78,0 Z" fill="%23E50914"/></svg>`;
                this.src = svgLogo;
            }
        };
    }
    
    // Set up navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-black');
        } else {
            navbar.classList.remove('navbar-black');
        }
    });
    
    // Set up mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('show-mobile-menu');
    });
    
    // Set up scrolling controls for movie rows
    setupRowScrolling();
    
    // Set up movie preview functionality
    setupMoviePreview();
    
    // Handle image loading for all posters
    document.querySelectorAll('.row-poster').forEach(poster => {
        if (!poster.complete) {
            poster.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        } else {
            poster.classList.add('loaded');
        }
    });
    
    // Call mobile enhancements when DOM is loaded
    enhanceMobileExperience();
});

/**
 * Try to load a local placeholder image first, then fallback to canvas-generated one
 * @param {HTMLElement} imgElement - The image element to apply fallback to
 * @param {String} originalSrc - The original src attribute value
 */
function tryLocalPlaceholder(imgElement, originalSrc) {
    console.log(`Image failed to load: ${originalSrc}. Trying placeholder...`);
    const localPlaceholder = new Image();
    localPlaceholder.onload = function() {
        console.log('Placeholder loaded successfully');
        imgElement.src = 'images/placeholder.svg';
        imgElement.setAttribute('data-fallback-loaded', 'true');
    };
    
    localPlaceholder.onerror = function() {
        console.error('Placeholder failed to load! Generating fallback...');
        // If local placeholder fails, generate one with canvas
        imgElement.src = generatePlaceholderImage();
        imgElement.setAttribute('data-fallback-loaded', 'true');
    };
    
    localPlaceholder.src = 'images/placeholder.svg';
}

/**
 * Update the banner with content from the current banner data index
 */
function updateBanner() {
    const bannerItem = bannerData[currentBannerIndex];
    
    // Create image element to preload
    const img = new Image();
    img.src = bannerItem.image;
    
    img.onload = () => {
        // Set banner background from preloaded image
        banner.style.backgroundImage = `url(${bannerItem.image})`;
        banner.removeAttribute('data-fallback-loaded');
        
        // Update banner content
        document.querySelector('.banner-title').textContent = bannerItem.title;
        document.querySelector('.banner-description').textContent = bannerItem.description;
        document.querySelector('.banner-match').textContent = bannerItem.match + ' Match';
        document.querySelector('.banner-year').textContent = bannerItem.year;
        document.querySelector('.banner-seasons').textContent = bannerItem.seasons;
        document.querySelector('.banner-classification').textContent = bannerItem.classification;
        document.querySelector('.banner-resolution').textContent = bannerItem.resolution;
    };
    
    img.onerror = () => {
        // Apply fallback styling with a gradient and SVG background
        banner.style.backgroundImage = generateBannerPlaceholder();
        banner.setAttribute('data-fallback-loaded', 'true');
        
        // Try the local banner placeholder
        const localBanner = new Image();
        localBanner.src = 'images/banner-placeholder.svg';
        
        // Still update the text content
        document.querySelector('.banner-title').textContent = bannerItem.title;
        document.querySelector('.banner-description').textContent = bannerItem.description;
        document.querySelector('.banner-match').textContent = bannerItem.match + ' Match';
        document.querySelector('.banner-year').textContent = bannerItem.year;
        document.querySelector('.banner-seasons').textContent = bannerItem.seasons;
        document.querySelector('.banner-classification').textContent = bannerItem.classification;
        document.querySelector('.banner-resolution').textContent = bannerItem.resolution;
    };
    
    // Rotate banner every 10 seconds
    setTimeout(() => {
        currentBannerIndex = (currentBannerIndex + 1) % bannerData.length;
        updateBanner();
    }, 10000);
}

/**
 * Set up scrolling functionality for movie rows
 */
function setupRowScrolling() {
    // Handle row scrolling with arrows
    rowPosters.forEach((row, index) => {
        // Variables for smooth scrolling
        let startX, scrollLeft, isDown = false;
        
        // Touch events for mobile scrolling
        row.addEventListener('touchstart', (e) => {
            isDown = true;
            row.classList.add('active');
            startX = e.touches[0].pageX - row.offsetLeft;
            scrollLeft = row.scrollLeft;
        });
        
        row.addEventListener('touchend', () => {
            isDown = false;
            row.classList.remove('active');
        });
        
        row.addEventListener('touchcancel', () => {
            isDown = false;
            row.classList.remove('active');
        });
        
        row.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - row.offsetLeft;
            const walk = (x - startX) * 2;
            row.scrollLeft = scrollLeft - walk;
        });
        
        // Mouse events for desktop scrolling
        row.addEventListener('mousedown', (e) => {
            isDown = true;
            row.classList.add('active');
            startX = e.pageX - row.offsetLeft;
            scrollLeft = row.scrollLeft;
        });
        
        row.addEventListener('mouseleave', () => {
            isDown = false;
            row.classList.remove('active');
        });
        
        row.addEventListener('mouseup', () => {
            isDown = false;
            row.classList.remove('active');
        });
        
        row.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - row.offsetLeft;
            const walk = (x - startX) * 2;
            row.scrollLeft = scrollLeft - walk;
        });
        
        // Arrow controls
        if (leftArrows[index]) {
            leftArrows[index].addEventListener('click', () => {
                row.scrollBy({
                    left: -row.clientWidth * 0.75,
                    behavior: 'smooth'
                });
            });
        }
        
        if (rightArrows[index]) {
            rightArrows[index].addEventListener('click', () => {
                row.scrollBy({
                    left: row.clientWidth * 0.75,
                    behavior: 'smooth'
                });
            });
        }
        
        // Show/hide arrows based on scroll position
        // Hide left arrow initially
        if (leftArrows[index]) {
            leftArrows[index].style.opacity = '0';
            leftArrows[index].style.pointerEvents = 'none';
        }
        
        row.addEventListener('scroll', () => {
            if (leftArrows[index] && rightArrows[index]) {
                // Show/hide left arrow
                if (row.scrollLeft > 20) {
                    leftArrows[index].style.opacity = '1';
                    leftArrows[index].style.pointerEvents = 'auto';
                } else {
                    leftArrows[index].style.opacity = '0';
                    leftArrows[index].style.pointerEvents = 'none';
                }
                
                // Show/hide right arrow
                if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 20) {
                    rightArrows[index].style.opacity = '0';
                    rightArrows[index].style.pointerEvents = 'none';
                } else {
                    rightArrows[index].style.opacity = '1';
                    rightArrows[index].style.pointerEvents = 'auto';
                }
            }
        });
    });
}

/**
 * Set up movie preview modal functionality
 */
function setupMoviePreview() {
    // Show preview modal when clicking on a poster
    posterContainers.forEach(container => {
        container.addEventListener('click', () => {
            // Get data from the clicked poster
            const title = container.querySelector('.row-poster-title')?.textContent || 'Movie Title';
            const match = container.querySelector('.row-poster-match')?.textContent || '95% Match';
            const poster = container.querySelector('.row-poster');
            
            // Update preview modal content
            document.querySelector('.preview-title').textContent = title;
            document.querySelector('.preview-match').textContent = match;
            
            // Set the background image for the preview header
            const previewHeader = document.querySelector('.preview-header');
            if (poster && poster.src && !poster.src.includes('data:image')) {
                // If the poster has a valid image (not a data URI fallback)
                previewHeader.style.backgroundImage = `url(${poster.src})`;
            } else {
                // Use a default background or generate one
                previewHeader.style.backgroundImage = generateBannerPlaceholder();
            }
            
            // Show preview modal with animation
            overlay.style.display = 'block';
            moviePreview.style.display = 'block';
            
            setTimeout(() => {
                overlay.style.opacity = '1';
                moviePreview.style.opacity = '1';
                moviePreview.style.transform = 'scale(1)';
            }, 10);
            
            // Prevent scrolling on body
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close preview modal
    previewClose.addEventListener('click', closePreviewModal);
    overlay.addEventListener('click', closePreviewModal);
}

/**
 * Close the movie preview modal
 */
function closePreviewModal() {
    overlay.style.opacity = '0';
    moviePreview.style.opacity = '0';
    moviePreview.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        overlay.style.display = 'none';
        moviePreview.style.display = 'none';
        // Re-enable scrolling on body
        document.body.style.overflow = 'auto';
    }, 300);
}

// Check if images directory exists and create placeholder
function createImageDirectoryIfNeeded() {
    const request = new XMLHttpRequest();
    request.open('HEAD', 'images/placeholder.svg', true);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 404) {
                console.warn('Placeholder image not found. Using dynamic placeholders instead.');
                // We've already implemented dynamic placeholders, so we're covered
            }
        }
    };
    request.send();
}

// Call to check for image directory
createImageDirectoryIfNeeded();

// Preload common images to improve performance
function preloadCommonImages() {
    const imagesToPreload = [
        'https://assets.nflxext.com/ffe/siteui/common/logos/netflix-logo.svg',
        'https://occ-0-2773-784.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdYJV5wt63AcxNaDoqDXUhqZb55oN5Dxt1m-Zdn_z5rn_hIq9m8dA8JB2xdcPmrY3yXnlVqv9WhvI7CQmkdD7WOjZAc.png?r=1d4'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Preload common images
preloadCommonImages();

/**
 * Mobile enhancements for better touch experiences
 */
function enhanceMobileExperience() {
    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile class to body for additional CSS targeting
        document.body.classList.add('mobile-device');
        
        // Add active states for all buttons to provide better touch feedback
        const allButtons = document.querySelectorAll('button, .row-poster, .nav-link, .mobile-link, .footer-link');
        allButtons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.classList.add('touch-active');
            });
            
            ['touchend', 'touchcancel'].forEach(event => {
                button.addEventListener(event, () => {
                    button.classList.remove('touch-active');
                    // Delay the removal of the active class for visual feedback
                    setTimeout(() => {
                        button.classList.remove('touch-active');
                    }, 150);
                });
            });
        });
        
        // Fix issue with 100vh on mobile browsers (iOS Safari particularly)
        function setVhVariable() {
            // Set a CSS variable equal to 1% of viewport height
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        // Set the --vh variable on initial load and resize
        setVhVariable();
        window.addEventListener('resize', setVhVariable);
        
        // Fix for "position: fixed" elements being hidden behind keyboard on some mobile browsers
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                document.body.classList.add('input-focused');
            });
            
            input.addEventListener('blur', () => {
                document.body.classList.remove('input-focused');
            });
        });
        
        // Add passive event listeners to improve scrolling performance
        document.querySelectorAll('.row-posters').forEach(row => {
            row.addEventListener('touchstart', () => {}, { passive: true });
            row.addEventListener('touchmove', () => {}, { passive: true });
        });
        
        // Optimize for foldable devices
        window.addEventListener('resize', debounce(() => {
            // Recalculate layout on fold/unfold
            adjustLayoutForScreenSize();
        }, 250));
    }
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Adjust layout based on screen size
 */
function adjustLayoutForScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    // Adjust row poster sizes for different screen ratios
    const rowPosters = document.querySelectorAll('.row-poster');
    
    if (aspectRatio > 2) { // Ultra-wide or foldable in landscape
        rowPosters.forEach(poster => {
            poster.style.minWidth = '130px';
            poster.style.height = '195px';
        });
    } else if (width < 360) { // Very small screens
        rowPosters.forEach(poster => {
            poster.style.minWidth = '100px';
            poster.style.height = '150px';
        });
    }
    
    // Adjust preview modal for different screen sizes
    const preview = document.getElementById('movie-preview');
    if (preview) {
        if (height < 600) {
            preview.style.height = '100%';
        } else if (height > 900) {
            preview.style.height = '90%';
        }
    }
} 