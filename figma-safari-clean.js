// Safari iframe fix for Figma Sites - Production Ready
// Copy this entire script to your Figma Sites custom code section

(function() {
    'use strict';
    
    // Detect Safari and WebKit browsers
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isWebKit = /webkit/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    
    if (!isSafari && !isWebKit) return; // Only run on Safari/WebKit
    
    console.log("🍎 Safari iframe fix activated");
    
    const safariIframeManager = {
        processedIframes: new Set(),
        heightCache: new Map(),
        
        findIframeBySource(source) {
            const iframes = Array.from(document.querySelectorAll('iframe'));
            for (let iframe of iframes) {
                try {
                    const src = iframe.src || iframe.getAttribute('src') || '';
                    if (src.includes('support.html') && source === 'support-html') return iframe;
                    if (src.includes('tags.html') && source === 'tags-html') return iframe;
                    if (src.includes('design.html') && source === 'design-html') return iframe;
                    if (src.includes('something.html') && source === 'something-html') return iframe;
                } catch (e) {
                    // Ignore security errors
                }
            }
            return null;
        },
        
        setIframeHeight(iframe, height, source) {
            if (!iframe || height <= 0) return;
            
            const minHeight = 50;
            const maxHeight = Math.max(window.innerHeight * 3, 2000);
            const safeHeight = Math.max(Math.min(height, maxHeight), minHeight);
            
            // Cache check to avoid unnecessary updates
            const cacheKey = iframe.src + '-' + source;
            const cachedHeight = this.heightCache.get(cacheKey);
            if (cachedHeight && Math.abs(cachedHeight - safeHeight) < 5) return;
            
            try {
                iframe.style.height = safeHeight + 'px';
                iframe.style.minHeight = minHeight + 'px';
                iframe.style.overflow = 'hidden';
                iframe.style.border = 'none';
                iframe.style.display = 'block';
                iframe.style.width = '100%';
                
                iframe.offsetHeight; // Force reflow
                this.heightCache.set(cacheKey, safeHeight);
                
                console.log(`🍎 Height set: ${source} → ${safeHeight}px`);
                
                // Safari workaround: ensure height sticks
                setTimeout(() => {
                    if (iframe.style.height !== safeHeight + 'px') {
                        iframe.style.height = safeHeight + 'px';
                    }
                }, 50);
                
            } catch (error) {
                console.warn(`🍎 Height error for ${source}:`, error);
            }
        },
        
        handleMessage(event) {
            try {
                if (!event.data || typeof event.data !== 'object') return;
                
                const { type, source, height, buttonId } = event.data;
                if (!source) return;
                
                const iframe = this.findIframeBySource(source);
                
                switch(type) {
                    case 'setIframeHeight':
                        if (iframe && height) {
                            this.setIframeHeight(iframe, height, source);
                        }
                        break;
                        
                    case 'iframeReady':
                        console.log(`🍎 Iframe ready: ${source}`);
                        if (iframe && iframe.contentWindow) {
                            setTimeout(() => {
                                try {
                                    iframe.contentWindow.postMessage({
                                        type: 'init',
                                        browser: 'safari',
                                        timestamp: Date.now()
                                    }, '*');
                                } catch (e) {
                                    // Ignore postMessage errors
                                }
                            }, 100);
                        }
                        break;
                        
                    case 'buttonActivated':
                    case 'interaction':
                        // Trigger height recalculation after interactions
                        setTimeout(() => {
                            if (iframe && iframe.contentWindow) {
                                try {
                                    iframe.contentWindow.postMessage({
                                        type: 'requestHeight',
                                        timestamp: Date.now()
                                    }, '*');
                                } catch (e) {
                                    // Ignore postMessage errors
                                }
                            }
                        }, 150);
                        break;
                }
            } catch (error) {
                // Suppress errors to avoid console spam
            }
        }
    };
    
    // Set up message listener
    window.addEventListener("message", function(event) {
        safariIframeManager.handleMessage(event);
    }, false);
    
    // Configure iframes for Safari
    function setupSafariIframes() {
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
            if (safariIframeManager.processedIframes.has(iframe)) return;
            
            // Safari-specific attributes
            iframe.style.overflow = 'hidden';
            iframe.style.border = 'none';
            iframe.style.display = 'block';
            iframe.style.width = '100%';
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('frameborder', '0');
            
            // Lazy loading fix
            if (!iframe.src && iframe.getAttribute('data-src')) {
                iframe.src = iframe.getAttribute('data-src');
            }
            
            safariIframeManager.processedIframes.add(iframe);
        });
    }
    
    // Window resize handler
    function handleWindowResize() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (iframe.contentWindow) {
                try {
                    iframe.contentWindow.postMessage({
                        type: 'resize',
                        width: window.innerWidth,
                        height: window.innerHeight
                    }, '*');
                } catch (e) {
                    // Ignore postMessage errors
                }
            }
        });
    }
    
    // Initialize Safari fixes
    function init() {
        setupSafariIframes();
        
        // Watch for new iframes
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'IFRAME' || (node.querySelectorAll && node.querySelectorAll('iframe').length > 0)) {
                                setTimeout(setupSafariIframes, 100);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Debounced window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleWindowResize, 250);
        });
        
        console.log("🍎 Safari iframe manager initialized");
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Backup initialization
    setTimeout(init, 1000);
    
})(); 