# Animated Word Transition System

This project features two synchronized HTML files that display animated text transitions with a "flying letter" effect. Words from predefined lists smoothly transition into each other, creating an engaging visual animation.

## Files

- **`something.html`**: Displays value-related words (e.g., "SOMETHING", "TRUST", "PURPOSE", "BEAUTY")
- **`design.html`**: Displays action-related words (e.g., "DESIGN", "CREATE", "BUILD", "ITERATE")

## Features

### Animation System
- **Letter Bridge Effect**: When transitioning between words, if a common letter exists between the current and next word, this letter visually "flies" from its position in the old word to its position in the new word
- **Smooth Transitions**: Fade-in/fade-out effects for non-bridge letters
- **Smart Letter Selection**: Avoids reusing the same letter as a bridge in consecutive transitions
- **Color Variation**: Each word has its own color, and consecutive words avoid color repetition
- **Fallback Handling**: If no common letter is found, performs a standard fade transition

### Synchronization
The two files are designed to work together in separate iframes with alternating animations:

1. **`something.html`** starts first (1500ms delay)
2. **`design.html`** starts second (2880ms delay) 
3. Both continue alternating with 2710ms intervals between transitions

## Technical Implementation

### Word Selection Algorithm
```javascript
// Priority order for next word selection:
1. Words with common letters (excluding the previous bridge letter)
2. Words with different colors (no common letter requirement)
3. Any other word (except current)
4. Fallback to first word in array
```

### Animation Stages
1. **Preparation**: Calculate dimensions and identify common letters
2. **Bridge Creation**: Extract common letter and position it absolutely
3. **Fade Out**: Hide old word parts (250ms)
4. **Letter Movement**: Animate bridge letter to new position (450ms)
5. **Fade In**: Show new word parts (270ms)
6. **Integration**: Merge bridge letter back into word flow

### Timing Configuration
- **Fade transitions**: 250ms out, 270ms in
- **Letter movement**: 450ms with cubic-bezier easing
- **Synchronization interval**: 2710ms between word changes
- **Initial delays**: 1500ms (something.html), 2880ms (design.html)

## Usage

### Basic Embedding
```html
<!-- Embed both iframes for synchronized effect -->
<iframe src="something.html" width="100%" height="200px" style="border: none;"></iframe>
<iframe src="design.html" width="100%" height="200px" style="border: none;"></iframe>
```

### Single File Usage
Either file can be used independently without synchronization concerns.

## Customization

### Word Lists
Edit the arrays in each file:
```javascript
// In something.html
const valueWords = [
  { text: "SOMETHING", color: "#E0E3D8" },
  { text: "TRUST", color: "#3560E2" },
  // ... add more words
];

// In design.html  
const actionWords = [
  { text: "DESIGN", color: "#E0E3D8" },
  { text: "CREATE", color: "#67CF3A" },
  // ... add more words
];
```

### Timing Adjustments
```javascript
// Change animation intervals
const initialInterval = 1500; // First transition delay
const nextInterval = 2710;    // Subsequent transitions
```

### Styling
Modify CSS variables:
```css
.hero-word-container {
  font-family: 'Anton', sans-serif;
  font-size: 200px;
  letter-spacing: -4px;
  /* ... other properties */
}
```

## Browser Compatibility

- Modern browsers with CSS animations support
- Requires JavaScript enabled
- Uses Google Fonts (Anton family)
- Responsive design adapts to container width

## Performance Notes

- Uses `requestAnimationFrame` for smooth animations
- Dynamically calculates letter positions for accuracy
- Temporary DOM elements are properly cleaned up
- Container width adjusts automatically to prevent overflow
