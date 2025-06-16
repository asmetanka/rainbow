/**
 * Safari-specific fixes for iframe height calculation in Figma Sites
 * This script addresses Safari's unique behavior with ResizeObserver and height calculation
 */

(function() {
    console.log("Safari iframe fix loaded");
    
    // Detect Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (!isSafari) {
        console.log("Not Safari, skipping Safari-specific fixes");
        return;
    }
    
    console.log("Safari detected, applying fixes");
    
    // Safari-specific height calculation
    function getSafariHeight() {
        const body = document.body;
        const html = document.documentElement;
        
        // Multiple height calculation methods for Safari
        const heights = [
            body.scrollHeight,
            body.offsetHeight,
            html.scrollHeight,
            html.offsetHeight,
            html.clientHeight
        ];
        
        // Safari sometimes reports 0 or very small heights initially
        const validHeights = heights.filter(h => h > 10);
        const maxHeight = Math.max(...validHeights);
        
        // Additional check for visible content
        const allElements = document.querySelectorAll('*');
        let maxElementBottom = 0;
        
        for (let element of allElements) {
            if (element.offsetParent !== null) { // Only visible elements
                const rect = element.getBoundingClientRect();
                const elementBottom = rect.bottom + window.pageYOffset;
                maxElementBottom = Math.max(maxElementBottom, elementBottom);
            }
        }
        
        // Use the larger of the calculated heights
        return Math.max(maxHeight, maxElementBottom, 100); // Minimum 100px
    }
    
    // Enhanced sendHeight function for Safari
    function safariSendHeight() {
        if (window.isSendHeightBusy) {
            console.log("Safari fix - sendHeight is busy, skipping call.");
            return;
        }
        window.isSendHeightBusy = true;
        
        // Force layout recalculation in Safari
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        // Small delay to let Safari settle
        setTimeout(() => {
            const height = getSafariHeight();
            
            // Add buffer for Safari (it tends to cut off content)
            const safariBuffer = 20;
            const finalHeight = height + safariBuffer;
            
            window.parent.postMessage({
                type: "setIframeHeight",
                height: finalHeight,
                source: window.source || "safari-iframe",
                safari: true // Mark as Safari-specific
            }, "*");
            
            console.log("Safari - Height sent to parent:", finalHeight);
            
            setTimeout(() => {
                window.isSendHeightBusy = false;
            }, 200); // Longer delay for Safari
        }, 100);
    }
    
    // Override the global sendHeight function if it exists
    if (typeof window.sendHeight === 'function') {
        console.log("Overriding existing sendHeight with Safari version");
        window.sendHeight = safariSendHeight;
    } else {
        window.sendHeight = safariSendHeight;
    }
    
    // Safari-specific event handlers
    let safariResizeTimeout;
    function safariResizeHandler() {
        clearTimeout(safariResizeTimeout);
        safariResizeTimeout = setTimeout(safariSendHeight, 250); // Longer delay for Safari
    }
    
    // Safari-specific mutation observer
    let safariMutationTimeout;
    function safariMutationHandler() {
        clearTimeout(safariMutationTimeout);
        safariMutationTimeout = setTimeout(safariSendHeight, 300); // Even longer delay for mutations
    }
    
    // Enhanced event listeners for Safari
    window.addEventListener('load', () => {
        setTimeout(safariSendHeight, 500); // Initial delay for Safari
    });
    
    window.addEventListener('resize', safariResizeHandler);
    window.addEventListener('orientationchange', safariResizeHandler);
    
    // Safari-specific mutation observer
    const safariObserver = new MutationObserver(safariMutationHandler);
    safariObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden']
    });
    
    // Monitor for description card visibility changes (specific to your app)
    const cardObserver = new MutationObserver(function(mutations) {
        let needsUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                const target = mutation.target;
                if (target.classList.contains('description-card') || 
                    target.classList.contains('show') ||
                    target.classList.contains('fading-in') ||
                    target.classList.contains('fading-out')) {
                    needsUpdate = true;
                }
            }
        });
        
        if (needsUpdate) {
            console.log("Safari - Description card state changed, updating height");
            setTimeout(safariSendHeight, 400); // Extra delay for animation completion
        }
    });
    
    // Start observing for description cards
    cardObserver.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class', 'style']
    });
    
    // Safari periodic check (more frequent for better UX)
    setInterval(safariSendHeight, 1500);
    
    // Safari-specific click handler with delayed height update
    document.addEventListener('click', function(event) {
        // Check if click was on a button or description area
        const target = event.target;
        const isButton = target.classList.contains('demo-button') || 
                        target.closest('.demo-button') ||
                        target.classList.contains('description-card') ||
                        target.closest('.description-card');
        
        if (isButton) {
            console.log("Safari - Button/card interaction detected");
            // Multiple delayed updates to catch animation states
            setTimeout(safariSendHeight, 100);  // Quick initial update
            setTimeout(safariSendHeight, 350);  // After fade-out
            setTimeout(safariSendHeight, 650);  // After fade-in
            setTimeout(safariSendHeight, 1000); // Final safety check
        }
    });
    
    console.log("Safari iframe fixes applied successfully");
})(); 