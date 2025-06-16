/**
 * Safari iframe height fix for Figma Sites
 * Resolves height calculation issues specific to Safari browsers
 * Usage: Include this script after your main height calculation script
 */

(function() {
    'use strict';
    
    // Only run in Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) return;
    
    console.log('Safari iframe height fix active');
    
    // Safari-specific height calculation with multiple fallbacks
    function calculateSafariHeight() {
        const body = document.body;
        const html = document.documentElement;
        
        // Temporarily remove height restrictions
        const originalBodyHeight = body.style.height;
        const originalHtmlHeight = html.style.height;
        
        body.style.height = 'auto';
        html.style.height = 'auto';
        
        // Force reflow
        html.offsetHeight;
        
        // Get various height measurements
        const measurements = [
            body.scrollHeight,
            body.offsetHeight,
            html.scrollHeight,
            html.offsetHeight
        ].filter(h => h > 0);
        
        // Calculate based on visible elements
        let maxBottom = 0;
        const visibleElements = Array.from(document.querySelectorAll('*'))
            .filter(el => el.offsetParent !== null);
            
        visibleElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const bottom = rect.bottom + window.pageYOffset;
            maxBottom = Math.max(maxBottom, bottom);
        });
        
        // Restore original heights
        body.style.height = originalBodyHeight;
        html.style.height = originalHtmlHeight;
        
        const calculatedHeight = Math.max(...measurements, maxBottom);
        return Math.max(calculatedHeight, 100) + 20; // Add Safari buffer
    }
    
    // Enhanced sendHeight function for Safari
    function safariSendHeight() {
        if (window.isSendHeightBusy) return;
        
        window.isSendHeightBusy = true;
        
        // Force layout recalculation
        document.body.style.transform = 'translateZ(0)';
        document.body.offsetHeight;
        document.body.style.transform = '';
        
        setTimeout(() => {
            const height = calculateSafariHeight();
            
            window.parent.postMessage({
                type: "setIframeHeight",
                height: height,
                source: window.source || "iframe",
                safari: true
            }, "*");
            
            setTimeout(() => {
                window.isSendHeightBusy = false;
            }, 200);
        }, 50);
    }
    
    // Override sendHeight if it exists
    if (typeof window.sendHeight === 'function') {
        window.sendHeight = safariSendHeight;
    }
    
    // Safari-specific event handling
    let safariTimeout;
    function debouncedSafariUpdate() {
        clearTimeout(safariTimeout);
        safariTimeout = setTimeout(safariSendHeight, 250);
    }
    
    // Monitor for content changes that affect height
    const observer = new MutationObserver((mutations) => {
        const relevantChange = mutations.some(mutation => {
            if (mutation.type === 'attributes') {
                const attr = mutation.attributeName;
                return attr === 'class' || attr === 'style';
            }
            return mutation.type === 'childList';
        });
        
        if (relevantChange) {
            debouncedSafariUpdate();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
    
    // Handle button clicks with multiple updates
    document.addEventListener('click', (event) => {
        const isInteractive = event.target.matches('button, .demo-button, [role="button"]') ||
                              event.target.closest('button, .demo-button, [role="button"]');
        
        if (isInteractive) {
            // Multiple updates to catch different animation phases
            setTimeout(safariSendHeight, 50);   // Immediate
            setTimeout(safariSendHeight, 300);  // After fadeout
            setTimeout(safariSendHeight, 600);  // After fadein
        }
    });
    
    // Initial setup
    window.addEventListener('load', () => {
        setTimeout(safariSendHeight, 300);
    });
    
    // Periodic check for Safari
    setInterval(safariSendHeight, 3000);
    
})(); 