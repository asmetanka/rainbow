# Animated Word Transition in Two Iframes

This project demonstrates two HTML files (`something replit.html` and `design replit.html`), each displaying an animated text effect where words smoothly transition into each other. The animations are synchronized to work alternately when used in separate iframes.

## How It Works

Each HTML file contains JavaScript logic for animating word transitions from predefined lists.

-   **`something replit.html`**: Displays words related to values or more abstract concepts (e.g., "SOMETHING", "TRUST", "PURPOSE").
-   **`design replit.html`**: Displays words related to actions or creative processes (e.g., "DESIGN", "CREATE", "BUILD").

### Key Animation Features:

1.  **Smooth Transition**: Words transition with fade in/out effects.
2.  **"Flying" Letter**: If there's a common letter between the current and next word (which wasn't the "landed" common letter in the previous transition), this letter visually "moves" from its position in the old word to the new position in the new word. This creates a connection effect between words.
3.  **Fallback Mechanism**: If no suitable common letter is found, the old word simply fades out and the new word appears.
4.  **Customizable Word Lists**: Word lists and their colors are defined in JavaScript arrays (`valueWords` in `something replit.html` and `actionWords` in `design replit.html`) and can be easily modified.
5.  **Styling**: Core styles (font, size, background) are set in CSS and can also be customized.

### Iframe Synchronization

The files are designed to work together in two separate iframes, creating an alternating word transition effect:

1.  **Start of `something replit.html` animation**: First word change occurs after **1500 ms** from load.
2.  **Pause**: After word change in `something replit.html`, there's a **500 ms** pause.
3.  **Start of `design replit.html` animation**: First word change occurs after **2880 ms** from load (1500 ms + ~880 ms animation + 500 ms pause).
4.  **Pause**: After word change in `design replit.html`, there's a **500 ms** pause.
5.  **Cycle**: Words in each iframe continue to change alternately. The interval for each subsequent word change (`nextInterval`) in both files is **2710 ms**. This value ensures enough time for one word animation (~880 ms), pause (500 ms), second word animation (~880 ms), and another pause (500 ms) before starting a new cycle.

## Usage

These files are intended to be embedded on a web page using `<iframe>` tags.

**Embedding Example:**

```html
<!-- Iframe for something replit.html -->
<iframe src="path/to/your/something replit.html" width="100%" height="200px" style="border: none;"></iframe>

<!-- Iframe for design replit.html -->
<iframe src="path/to/your/design replit.html" width="100%" height="200px" style="border: none;"></iframe>
```

Replace `path/to/your/` with the actual path to your files. The height (`height`) can be adjusted as needed.

## Customization

-   **Words and Colors**: Modify the `valueWords` array (in `something replit.html`) and `actionWords` array (in `design replit.html`) to use your own sets of words and their corresponding colors.
-   **Timings**:
    -   `initialInterval`: Constant at the end of each file's JavaScript code, determines the delay before the *first* word change.
    -   `nextInterval`: Constant in the `changeWord` function of each file, determines the interval between *subsequent* word changes.
-   **Styles**: CSS styles for font, background, sizes, and animations can be found in the `<style>` tag of each file.

## File Structure (similar for both .html files)

-   **HTML**:
    -   Google Fonts connection ('Anton').
    -   CSS styles for general appearance, word container, and animated parts.
    -   Main markup: `<div id="wrapper">` (for centering) and `<div class="hero-word-container">`, which initially displays the first word.
-   **JavaScript**:
    -   Word arrays (`valueWords` or `actionWords`).
    -   Core variables (`currentWordIndex`, `container`, `lastLandedBridgeInfo`).
    -   Functions:
        -   `getRandomInterval()`: Helper function for getting random intervals (currently not used for word selection but may be useful for other purposes).
        -   `findCommonLetters()`: Finds common letters between words.
        -   `calculateLetterPosition()`: Calculates the visual position of a letter in a word.
        -   `getRandomWordWithCommonLetter()`: Logic for selecting the next word and common letter.
        -   `animateWordTransition()`: Controls the entire visual transition animation.
        -   `changeWord()`: Main word change cycle, manages timings.
    -   Initialization: Setting timers for the first word change using `initialInterval`.
