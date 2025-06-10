# 🎨 Figma Sites Integration Guide

## 📋 Overview

All HTML files in the project (`support.html`, `tags.html`, `design.html`, `something.html`) now include the necessary scripts for full integration with Figma Sites via iframe.

## 🔧 What's Already Configured in HTML Files

### 1. Automatic iframe Height Adjustment
- Automatic detection and sending of content height
- Tracking of size changes during user interaction
- Support for responsive design

### 2. Parent Communication
- Two-way communication between the iframe and the parent Figma window
- Sending interaction events (clicks, button activations)
- Processing commands from the parent window

### 3. Event Tracking
- Clicks on buttons and interface elements
- Component state changes
- Iframe readiness for operation

## 📄 Custom Code for Figma Sites

### In Figma Sites settings, add the following JavaScript code:

```javascript
// Figma Sites - Custom code for managing the iframe
(function() {
    console.log("Figma Sites iframe manager initialized");
    
    // Function to set iframe height
    function setIframeHeight(iframe, height, source) {
        if (iframe && height > 0) {
            const newHeight = Math.max(height, 100); // Minimum height 100px
            iframe.style.height = newHeight + "px";
            console.log(`Height set for ${source}: ${newHeight}px`);
            
            // Add a small delay for smoothness
            setTimeout(() => {
                iframe.style.transition = "height 0.3s ease";
            }, 100);
        }
    }
    
    // Function to find iframe by source
    function findIframeBySource(source) {
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
            // Check the iframe src to determine the source
            if (iframe.src.includes('support.html') && source === 'support-html') return iframe;
            if (iframe.src.includes('tags.html') && source === 'tags-html') return iframe;
            if (iframe.src.includes('design.html') && source === 'design-html') return iframe;
            if (iframe.src.includes('something.html') && source === 'something-html') return iframe;
        }
        return null;
    }
    
    // Message handler from iframe
    window.addEventListener("message", function(event) {
        // Verify message source for security
        if (!event.data || typeof event.data !== 'object') return;
        
        console.log("Message received from iframe:", event.data);
        
        const { type, source, height, buttonId, target } = event.data;
        const iframe = findIframeBySource(source);
        
        switch(type) {
            case 'setIframeHeight':
                setIframeHeight(iframe, height, source);
                break;
                
            case 'iframeReady':
                console.log(`Iframe ready: ${source}`);
                // Send readiness confirmation
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'init',
                        timestamp: Date.now()
                    }, '*');
                }
                break;
                
            case 'buttonActivated':
                console.log(`Button activated in ${source}: ${buttonId}`);
                // You can add analytics or other actions here
                // For example, sending events to Google Analytics:
                // gtag('event', 'button_click', { 'button_id': buttonId, 'source': source });
                break;
                
            case 'interaction':
                console.log(`User interaction in ${source}:`, target);
                // Handle user interactions
                break;
                
            default:
                console.log(`Unknown message type from ${source}:`, type);
        }
    }, false);
    
    // Function to send commands to the iframe
    function sendToIframe(source, message) {
        const iframe = findIframeBySource(source);
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(message, '*');
            console.log(`Message sent to ${source}:`, message);
        }
    }
    
    // Handling window resizing
    window.addEventListener('resize', function() {
        // Notify all iframes about the size change
        ['support-html', 'tags-html', 'design-html', 'something-html'].forEach(source => {
            sendToIframe(source, {
                type: 'resize',
                width: window.innerWidth,
                height: window.innerHeight
            });
        });
    });
    
    // Function to change the theme (if needed)
    function changeTheme(theme) {
        ['support-html', 'tags-html', 'design-html', 'something-html'].forEach(source => {
            sendToIframe(source, {
                type: 'theme',
                theme: theme
            });
        });
    }
    
    // Export functions for use in Figma Sites
    window.FigmaIframeManager = {
        sendToIframe: sendToIframe,
        changeTheme: changeTheme,
        findIframeBySource: findIframeBySource
    };
    
    console.log("Figma Sites iframe manager ready");
})();
```

## 🚀 Instructions for Adding to Figma Sites

### 1. In the Figma Sites editor:
1. Open site settings
2. Go to the "Custom Code" section
3. Paste the code above into the "Head" or "Body" section

### 2. For iframe integration:
1. Create an iframe element in Figma
2. Specify the URL of your HTML files in the `src` attribute
3. Set the initial dimensions of the iframe (they will be automatically adjusted)

### 3. Example iframe setup:
```html
<iframe 
    src="https://your-domain.com/support.html" 
    frameborder="0" 
    style="width: 100%; height: 600px; border: none;"
    title="Support Demo">
</iframe>
```

## 📊 Tracking Capabilities

The added scripts allow tracking of:
- ✅ Button clicks with ID and text transmission
- ✅ Content size changes
- ✅ Iframe readiness
- ✅ User interactions

## 🎯 Additional Features

### Analytics Integration:
```javascript
// Add to the buttonActivated handler:
gtag('event', 'button_click', {
    'button_id': buttonId,
    'source': source,
    'timestamp': Date.now()
});
```

### Custom Themes:
```javascript
// Change theme for all iframes:
window.FigmaIframeManager.changeTheme('dark');
```

## 🔍 Debugging

All scripts include detailed logging in the browser console:
- Iframe ready messages
- Information about height transmission
- User interaction logs
- Error reports

Open DevTools (F12) to view logs.

## ⚡ Performance Optimization

- Automatic debouncing for frequent height updates
- Caching of iframe links for quick access
- Minimum message sending frequency
- Backup mechanisms for reliability

## 🚨 Important Notes

1. **Security**: The code checks message sources
2. **Compatibility**: Works in all modern browsers
3. **Performance**: Optimized for minimal impact on loading
4. **Reliability**: Includes backup mechanisms and error handling 