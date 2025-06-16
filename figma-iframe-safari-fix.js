/**
 * Safari-specific fixes for iframe resizing in Figma Sites
 * 
 * Safari has stricter security policies and different behavior with:
 * - postMessage API
 * - ResizeObserver
 * - Cross-origin iframe communication
 * - Document height calculation
 * 
 * This script should be added to your Figma Sites custom code section.
 */

(function() {
    'use strict';
    
    console.log("Safari iframe fix initialized");
    
    // Detect Safari browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isWebKit = /webkit/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    
    if (!isSafari && !isWebKit) {
        console.log("Not Safari, skipping Safari-specific fixes");
        return;
    }
    
    console.log("Safari detected, applying iframe fixes");
    
    // Safari-specific iframe height management
    const safariIframeManager = {
        processedIframes: new Set(),
        heightCache: new Map(),
        
        // Enhanced iframe finder for Safari
        findIframeBySource: function(source) {
            const iframes = Array.from(document.querySelectorAll('iframe'));
            for (let iframe of iframes) {
                try {
                    const src = iframe.src || iframe.getAttribute('src') || '';
                    if (src.includes('support.html') && source === 'support-html') return iframe;
                    if (src.includes('tags.html') && source === 'tags-html') return iframe;
                    if (src.includes('design.html') && source === 'design-html') return iframe;
                    if (src.includes('something.html') && source === 'something-html') return iframe;
                } catch (e) {
                    console.warn("Error checking iframe src:", e);
                }
            }
            return null;
        },
        
        // Safari-specific height setting with additional checks
        setIframeHeight: function(iframe, height, source) {
            if (!iframe || height <= 0) {
                console.warn(`Safari fix: Invalid iframe or height for ${source}`);
                return;
            }
            
            const minHeight = 50;
            const maxHeight = Math.max(window.innerHeight * 3, 2000); // Prevent unreasonable heights
            const safeHeight = Math.max(Math.min(height, maxHeight), minHeight);
            
            // Cache the height to avoid unnecessary updates
            const cacheKey = iframe.src + '-' + source;
            const cachedHeight = this.heightCache.get(cacheKey);
            
            if (cachedHeight && Math.abs(cachedHeight - safeHeight) < 5) {
                return; // Skip if height change is minimal
            }
            
            try {
                // Force iframe to have specific attributes for Safari
                iframe.style.height = safeHeight + 'px';
                iframe.style.minHeight = minHeight + 'px';
                iframe.style.maxHeight = maxHeight + 'px';
                iframe.style.overflow = 'hidden';
                iframe.style.border = 'none';
                iframe.style.display = 'block';
                iframe.style.width = '100%';
                
                // Safari-specific: Force layout recalculation
                iframe.offsetHeight; // Trigger reflow
                
                // Update cache
                this.heightCache.set(cacheKey, safeHeight);
                
                console.log(`Safari fix: Height set for ${source}: ${safeHeight}px`);
                
                // Additional Safari workaround: slight delay for complex layouts
                setTimeout(() => {
                    if (iframe.style.height !== safeHeight + 'px') {
                        iframe.style.height = safeHeight + 'px';
                        console.log(`Safari fix: Height re-applied for ${source}`);
                    }
                }, 50);
                
            } catch (error) {
                console.error(`Safari fix: Error setting height for ${source}:`, error);
            }
        },
        
        // Enhanced message handler for Safari
        handleMessage: function(event) {
            // Safari security: be more specific about origin checking
            try {
                if (!event.data || typeof event.data !== 'object') {
                    return;
                }
                
                console.log("Safari fix: Message received:", event.data);
                
                const { type, source, height, buttonId, target } = event.data;
                
                if (!source) {
                    console.warn("Safari fix: Message missing source identifier");
                    return;
                }
                
                const iframe = this.findIframeBySource(source);
                
                switch(type) {
                    case 'setIframeHeight':
                        if (iframe && height) {
                            this.setIframeHeight(iframe, height, source);
                        } else {
                            console.warn(`Safari fix: No iframe found for ${source} or invalid height:`, height);
                        }
                        break;
                        
                    case 'iframeReady':
                        console.log(`Safari fix: Iframe ready: ${source}`);
                        if (iframe && iframe.contentWindow) {
                            try {
                                iframe.contentWindow.postMessage({
                                    type: 'init',
                                    timestamp: Date.now(),
                                    browser: 'safari'
                                }, '*');
                                console.log(`Safari fix: Init message sent to ${source}`);
                            } catch (e) {
                                console.warn(`Safari fix: Could not send init to ${source}:`, e);
                            }
                        }
                        break;
                        
                    case 'buttonActivated':
                        console.log(`Safari fix: Button activated in ${source}: ${buttonId}`);
                        // Trigger height recalculation after button interaction
                        setTimeout(() => {
                            if (iframe && iframe.contentWindow) {
                                try {
                                    iframe.contentWindow.postMessage({
                                        type: 'requestHeight',
                                        timestamp: Date.now()
                                    }, '*');
                                } catch (e) {
                                    console.warn("Safari fix: Could not request height update:", e);
                                }
                            }
                        }, 100);
                        break;
                        
                    case 'interaction':
                        console.log(`Safari fix: User interaction in ${source}:`, target);
                        // Similar height recalculation for interactions
                        setTimeout(() => {
                            if (iframe && iframe.contentWindow) {
                                try {
                                    iframe.contentWindow.postMessage({
                                        type: 'requestHeight',
                                        timestamp: Date.now()
                                    }, '*');
                                } catch (e) {
                                    console.warn("Safari fix: Could not request height after interaction:", e);
                                }
                            }
                        }, 150);
                        break;
                        
                    default:
                        console.log(`Safari fix: Unknown message type: ${type}`);
                }
            } catch (error) {
                console.error("Safari fix: Error handling message:", error);
            }
        }
    };
    
    // Set up message listener with Safari-specific handling
    window.addEventListener("message", function(event) {
        safariIframeManager.handleMessage(event);
    }, false);
    
    // Safari-specific iframe setup
    function setupSafariIframes() {
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach((iframe, index) => {
            if (safariIframeManager.processedIframes.has(iframe)) {
                return; // Already processed
            }
            
            // Safari-specific iframe attributes
            iframe.style.overflow = 'hidden';
            iframe.style.border = 'none';
            iframe.style.display = 'block';
            iframe.style.width = '100%';
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('frameborder', '0');
            
            // Safari: Force iframe to load
            if (!iframe.src && iframe.getAttribute('data-src')) {
                iframe.src = iframe.getAttribute('data-src');
            }
            
            safariIframeManager.processedIframes.add(iframe);
            
            console.log(`Safari fix: Processed iframe ${index + 1}:`, iframe.src);
        });
    }
    
    // Safari-specific window resize handler
    function handleWindowResize() {
        console.log("Safari fix: Window resized, notifying iframes");
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
            if (iframe.contentWindow) {
                try {
                    iframe.contentWindow.postMessage({
                        type: 'resize',
                        width: window.innerWidth,
                        height: window.innerHeight,
                        browser: 'safari'
                    }, '*');
                } catch (e) {
                    console.warn("Safari fix: Could not send resize message:", e);
                }
            }
        });
    }
    
    // Initialize Safari fixes
    function initSafariFixes() {
        console.log("Initializing Safari iframe fixes...");
        
        // Setup existing iframes
        setupSafariIframes();
        
        // Watch for new iframes
        const iframeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'IFRAME') {
                                console.log("Safari fix: New iframe detected");
                                setTimeout(setupSafariIframes, 100);
                            } else if (node.querySelectorAll) {
                                const newIframes = node.querySelectorAll('iframe');
                                if (newIframes.length > 0) {
                                    console.log(`Safari fix: ${newIframes.length} new iframes detected in added content`);
                                    setTimeout(setupSafariIframes, 100);
                                }
                            }
                        }
                    });
                }
            });
        });
        
        iframeObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Window resize handling
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleWindowResize, 250);
        });
        
        console.log("Safari iframe fixes initialized successfully");
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSafariFixes);
    } else {
        initSafariFixes();
    }
    
    // Backup initialization
    setTimeout(initSafariFixes, 1000);
    
})(); 