import React, { useState, useEffect, useRef } from 'react';

const valueWords = [
  { text: "SOMETHING", color: "#E0E3D8" },
  { text: "TRUST", color: "#3560E2" },
  { text: "PURPOSE", color: "#67CF3A" },
  { text: "BEAUTY", color: "#845DD9" },
  { text: "SIMPLICITY", color: "#845DD9" },
  { text: "IMPACT", color: "#F7D80E" },
  { text: "GROWTH", color: "#1FC37E" },
  { text: "AUTHENTICITY", color: "#FFB221" },
  { text: "CLARITY", color: "#FF6237" },
  { text: "JOY", color: "#F7D80E" },
  { text: "BALANCE", color: "#1FC37E" },
  { text: "HUMANITY", color: "#FFB221" },
  { text: "VALUE", color: "#3560E2" },
  { text: "QUALITY", color: "#67CF3A" },
  { text: "CONVERSION", color: "#3560E2" },
  { text: "UNDERSTANDING", color: "#F54242" },
  { text: "USER SUCCESS", color: "#1FC37E" },
  { text: "COMPASSION", color: "#845DD9" },
  { text: "INNOVATION", color: "#FFB221" },
  { text: "FUTURE", color: "#F7D80E" },
  { text: "DIVERSITY", color: "#F54242" },
  { text: "RESPECT", color: "#3560E2" },
  { text: "LOYALTY", color: "#1FC37E" },
  { text: "WARMTH", color: "#FFB221" },
  { text: "HONESTY", color: "#67CF3A" },
  { text: "ESSENCE", color: "#FFB221" },
  { text: "SERENITY", color: "#845DD9" },
  { text: "INSIGHT", color: "#FF6237" },
  { text: "PEACE", color: "#F7D80E" },
  { text: "DEEP CARE", color: "#F54242" },
  { text: "BELONGING", color: "#F7D80E" },
  { text: "EVERYDAY LIFE", color: "#67CF3A" },
  { text: "WHAT MATTERS", color: "#FF6237" },
  { text: "DIFFERENCE", color: "#845DD9" },
  { text: "STILLNESS", color: "#845DD9" },
  { text: "EASE", color: "#F54242" },
  { text: "DELIGHT", color: "#3560E2" },
  { text: "REFINEMENT", color: "#67CF3A" },
  { text: "ALIGNMENT", color: "#1FC37E" },
  { text: "FOCUS", color: "#FF6237" },
  { text: "CONNECTION", color: "#FFB221" },
  { text: "TRUTH", color: "#67CF3A" },
  { text: "EMPATHY", color: "#F54242" }
];

const SomethingStyles = () => (
  <style>
    {`
      .something-component {
        margin: 0;
        padding: 0;
        overflow: visible;
        height: 100%;
        background: #010214;
        font-family: 'Anton', sans-serif;
      }

      .something-wrapper {
        padding-top: 0;
        box-sizing: border-box;
        height: 100vh;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
      }

      .hero-word-container {
        position: relative;
        display: block;
        min-height: 190px;
        font-family: 'Anton', sans-serif;
        font-size: 200px;
        line-height: 176px;
        font-weight: 500;
        letter-spacing: -4px;
        white-space: nowrap;
        overflow: visible;
        width: 100%;
        max-width: 100vw;
        font-size: 0;
        text-align: left;
        padding-left: 0;
        margin-left: 0;
      }

      .word-part {
        display: inline-block;
        font-size: 200px;
        line-height: 176px;
        margin: 0;
        padding: 0;
        vertical-align: baseline;
      }

      .word-part.fading-out {
        animation: fadeOut 0.25s ease-out forwards;
      }

      .word-part.fading-in {
        animation: fadeIn 0.25s ease-in forwards;
        opacity: 0;
      }

      .common-letter {
        position: relative;
        z-index: 10;
      }

      .common-letter.moving {
        position: absolute;
        transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      @keyframes fadeOut {
        from { opacity: 1; }
        to   { opacity: 0; }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
    `}
  </style>
);

const Something = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentWordIndexRef = useRef(0);
  const containerRef = useRef(null);
  const lastLandedBridgeInfoRef = useRef(null);
  const lastBridgeCharRef = useRef(null);

  /**
   * Generates a random number between min and max (inclusive).
   */
  const getRandomInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Finds the first common letter between two words, excluding all occurrences of a specific letter if specified.
   */
  const findCommonLetters = (word1, word2, excludedChar = null) => {
    const letters1 = word1.toLowerCase().split('');
    const letters2 = word2.toLowerCase().split('');
    for (let i = 0; i < letters1.length; i++) {
      const char1 = letters1[i];
      if (excludedChar && char1 === excludedChar.toLowerCase()) continue;
      if (char1 !== ' ' && letters2.includes(char1)) {
        return {
          letter: word1.charAt(i).toUpperCase(),
          positionInWord1: i,
          positionInWord2: letters2.indexOf(char1)
        };
      }
    }
    return null;
  };

  /**
   * Calculates the position (left offset in pixels) of a letter in a word.
   * Used to determine where the common letter should "land".
   */
  const calculateLetterPosition = (word, letterIndex) => {
    const tempSpan = document.createElement('span');
    tempSpan.style.fontFamily = 'Anton, sans-serif';
    tempSpan.style.fontSize = '200px';
    tempSpan.style.letterSpacing = '-4px';
    tempSpan.style.whiteSpace = 'nowrap';

    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.textContent = word.substring(0, letterIndex);
    document.body.appendChild(tempSpan);
    
    const width = tempSpan.getBoundingClientRect().width; 
    document.body.removeChild(tempSpan);
    
    return width;
  };

  /**
   * Selects a random next word for animation.
   * GUARANTEES that the selected word has a common letter with the current word.
   * Priority is given to words with a common letter different from the previous flying letter.
   * Also avoids repeating the word color when possible.
   */
  const getRandomWordWithCommonLetter = (currentWordText, excludeColor, excludedChar) => {
    
    // Phase 1: Look for words with different color AND different common letter than excluded
    const phase1Candidates = [];
    valueWords.forEach(wordObj => {
      if (wordObj.color !== excludeColor && wordObj.text !== currentWordText) {
        const info = findCommonLetters(currentWordText, wordObj.text, excludedChar);
        if (info) {
          phase1Candidates.push({word: wordObj, commonInfo: info});
        }
      }
    });
    
    if (phase1Candidates.length > 0) {
      const selected = phase1Candidates[Math.floor(Math.random() * phase1Candidates.length)];
      return selected;
    }

    // Phase 2: Look for words with different color, allowing same common letter as excluded
    const phase2Candidates = [];
    valueWords.forEach(wordObj => {
      if (wordObj.color !== excludeColor && wordObj.text !== currentWordText) {
        const info = findCommonLetters(currentWordText, wordObj.text, null); // No exclusion
        if (info) {
          phase2Candidates.push({word: wordObj, commonInfo: info});
        }
      }
    });
    
    if (phase2Candidates.length > 0) {
      const selected = phase2Candidates[Math.floor(Math.random() * phase2Candidates.length)];
      return selected;
    }

    // Phase 3: Look for ANY word (except current) with common letters, ignoring color
    const phase3Candidates = [];
    valueWords.forEach(wordObj => {
      if (wordObj.text !== currentWordText) {
        const info = findCommonLetters(currentWordText, wordObj.text, excludedChar);
        if (info) {
          phase3Candidates.push({word: wordObj, commonInfo: info});
        }
      }
    });
    
    if (phase3Candidates.length > 0) {
      const selected = phase3Candidates[Math.floor(Math.random() * phase3Candidates.length)];
      return selected;
    }

    // Phase 4: Absolute fallback - ANY word with ANY common letter
    const phase4Candidates = [];
    valueWords.forEach(wordObj => {
      if (wordObj.text !== currentWordText) {
        const info = findCommonLetters(currentWordText, wordObj.text, null); // No exclusions
        if (info) {
          phase4Candidates.push({word: wordObj, commonInfo: info});
        }
      }
    });
    
    if (phase4Candidates.length > 0) {
      const selected = phase4Candidates[Math.floor(Math.random() * phase4Candidates.length)];
      return selected;
    }

    // This should NEVER happen with a proper word list!
    console.error(`🚨 CRITICAL ERROR: No words found with common letters for "${currentWordText}"!`);
    console.error("🚨 This indicates a problem with the word list - every word should have common letters with other words!");
    
    // Emergency fallback - just pick any other word, but this should never execute
    const emergencyWord = valueWords.find(w => w.text !== currentWordText) || valueWords[0];
    console.error(`🚨 Emergency fallback to: "${emergencyWord.text}" WITHOUT common letter animation`);
    return {word: emergencyWord, commonInfo: null};
  };

  /**
   * Animates the transition between the current and new word.
   * If a common letter is found, it "flies" from the old word to the new one.
   * Otherwise, the old word disappears and the new one appears.
   */
  const animateWordTransition = async (currentWordObj, newWordObj, commonLetterInfoToUse, currentWordBaseColor) => {
    const container = containerRef.current;
    if (!container) return;

    const commonLetterInfo = commonLetterInfoToUse;
    const currentContainerWidth = container.offsetWidth;

    let requiredWidthForNewWord = 0;
    const tempSpanForWidthCalc = document.createElement('span');
    tempSpanForWidthCalc.style.fontFamily = 'Anton, sans-serif';
    tempSpanForWidthCalc.style.fontSize = '200px';
    tempSpanForWidthCalc.style.letterSpacing = '-4px';
    tempSpanForWidthCalc.style.whiteSpace = 'nowrap';
    tempSpanForWidthCalc.style.visibility = 'hidden';
    tempSpanForWidthCalc.style.position = 'absolute'; 
    tempSpanForWidthCalc.textContent = newWordObj.text;
    document.body.appendChild(tempSpanForWidthCalc);
    requiredWidthForNewWord = tempSpanForWidthCalc.getBoundingClientRect().width;
    document.body.removeChild(tempSpanForWidthCalc);

    const safetyBuffer = 40; // Significantly increase buffer to 40px
    container.style.width = Math.max(currentContainerWidth, requiredWidthForNewWord) + safetyBuffer + 'px';
    
    const containerRect = container.getBoundingClientRect();

    let bridgeLetterElement = null;
    let initialXOfBridgeLetterInContainer = 0;
    let targetXOfBridgeLetterInContainer = 0;

    if (commonLetterInfo) {
      const { letter: commonLetterChar, positionInWord1, positionInWord2 } = commonLetterInfo;
      
      // 1. Get the color of the flying letter more reliably
      let originalColor = currentWordBaseColor;
      const currentChildSpans = Array.from(container.childNodes).filter(node => node.nodeType === 1 && node.classList.contains('word-part'));
      
      // Find the span that contains our letter by rebuilding the word from spans
      let reconstructedText = '';
      let targetSpan = null;
      let targetSpanStartPosition = 0;
      
      for (const span of currentChildSpans) {
          const spanText = span.textContent || '';
          const spanStart = reconstructedText.length;
          const spanEnd = spanStart + spanText.length;
          
          if (spanStart <= positionInWord1 && positionInWord1 < spanEnd) {
              targetSpan = span;
              targetSpanStartPosition = spanStart;
              break;
          }
          reconstructedText += spanText;
      }
      
      if (targetSpan) {
          const localPosInSpan = positionInWord1 - targetSpanStartPosition;
          const actualCharInSpan = targetSpan.textContent.charAt(localPosInSpan);
          
          // Verify the character matches what we expect
          if (actualCharInSpan.toUpperCase() === commonLetterChar.toUpperCase()) {
              originalColor = targetSpan.style.color || currentWordBaseColor;
          } else {
              targetSpan = null; // Force fallback
          }
      }
      
      // Verification: ensure the letter at the expected position matches what we found
      const actualLetterFromOriginalText = currentWordObj.text.charAt(positionInWord1);
      if (actualLetterFromOriginalText.toUpperCase() !== commonLetterChar.toUpperCase()) {
          targetSpan = null; // Force fallback
      }
      
      // If we couldn't find the right span or character doesn't match, fall back to simple transition
      if (!targetSpan) {
          console.warn(`🚨 Falling back to simple transition due to span/character issues`);
          const allCurrentParts = container.querySelectorAll('.word-part');
          allCurrentParts.forEach(part => part.classList.add('fading-out'));
          setTimeout(() => {
              container.innerHTML = `<span class="word-part fading-in" style="color: ${newWordObj.color};">${newWordObj.text}</span>`;
              setTimeout(() => {
                  const newWordEl = container.querySelector('.word-part.fading-in');
                  if (newWordEl) newWordEl.classList.remove('fading-in');
                  container.style.width = 'auto';
              }, 270);
          }, 250);
          return;
      }

      // 2. Create the flying letter element (bridge)
      const bridgeLetterElement = document.createElement('span');
      bridgeLetterElement.className = 'word-part common-letter';
      bridgeLetterElement.textContent = commonLetterChar;
      bridgeLetterElement.style.color = originalColor;
      bridgeLetterElement.style.position = 'absolute';
      bridgeLetterElement.style.top = '0px';

      // 3. Calculate start and end positions for the flight
      const initialX = calculateLetterPosition(currentWordObj.text, positionInWord1);
      const targetX = calculateLetterPosition(newWordObj.text, positionInWord2);
      const deltaX = targetX - initialX;

      bridgeLetterElement.style.left = `${initialX}px`;
      
      // 4. Fade out the old word, but keep the container intact
      currentChildSpans.forEach(span => span.classList.add('fading-out'));
      
      // Add bridge to container AFTER starting fade out of other letters
      container.appendChild(bridgeLetterElement);

      // 5. Animate the transition
      setTimeout(() => {
          // After fade out is complete, remove the old spans.
          // The bridge element is the last child, so we remove everything before it.
          while (container.firstChild && container.firstChild !== bridgeLetterElement) {
              container.removeChild(container.firstChild);
          }

          // Use rAF to ensure the initial state is painted before the transition starts.
          requestAnimationFrame(() => {
              bridgeLetterElement.classList.add('moving');
              bridgeLetterElement.style.transform = `translateX(${deltaX}px)`;
          });

          // After a delay, build the new word structure and insert it BEFORE the flying letter
          setTimeout(() => {
              const fragment = document.createDocumentFragment();
              const textBefore = newWordObj.text.substring(0, positionInWord2);
              const textAfter = newWordObj.text.substring(positionInWord2 + 1);

              if (textBefore) {
                  const beforeSpan = document.createElement('span');
                  beforeSpan.className = 'word-part fading-in';
                  beforeSpan.style.color = newWordObj.color;
                  beforeSpan.textContent = textBefore;
                  fragment.appendChild(beforeSpan);
              }

              const placeholderSpan = document.createElement('span');
              placeholderSpan.className = 'word-part common-letter-placeholder fading-in';
              placeholderSpan.style.color = '#010214'; // Invisible color
              placeholderSpan.textContent = commonLetterChar;
              fragment.appendChild(placeholderSpan);

              if (textAfter) {
                  const afterSpan = document.createElement('span');
                  afterSpan.className = 'word-part fading-in';
                  afterSpan.style.color = newWordObj.color;
                  afterSpan.textContent = textAfter;
                  fragment.appendChild(afterSpan);
              }
              container.insertBefore(fragment, bridgeLetterElement);
          }, 150);

          // When the flight is complete, replace the placeholder
          setTimeout(() => {
              const placeholder = container.querySelector('.common-letter-placeholder');
              
              // Final check to prevent errors if elements are missing
              if (placeholder && bridgeLetterElement.parentNode === container) {
                  container.replaceChild(bridgeLetterElement, placeholder);
              } else if (bridgeLetterElement.parentNode) {
                  // Fallback cleanup if placeholder logic fails
                  bridgeLetterElement.parentNode.removeChild(bridgeLetterElement);
              }
              
              // Finalize styles
              bridgeLetterElement.style.position = 'relative';
              bridgeLetterElement.style.left = '';
              bridgeLetterElement.style.top = '';
              bridgeLetterElement.style.transform = '';
              bridgeLetterElement.classList.remove('moving', 'common-letter');

              container.querySelectorAll('.word-part').forEach(node => {
                  node.classList.remove('fading-in');
              });
              
              container.style.width = 'auto';

          }, 450 + 50); // Flight duration + buffer

      }, 250); // Corresponds to the fade-out duration

    } else {
      const allCurrentParts = container.querySelectorAll('.word-part');
      allCurrentParts.forEach(part => part.classList.add('fading-out'));
      setTimeout(() => {
        container.innerHTML = `<span class="word-part fading-in" style="color: ${newWordObj.color};">${newWordObj.text}</span>`;
        setTimeout(() => {
          const newWordEl = container.querySelector('.word-part.fading-in');
          if (newWordEl) newWordEl.classList.remove('fading-in');
          container.style.width = 'auto';
        }, 270); 
      }, 250); 
    }
  };

  /**
   * Main function for changing words.
   * Gets the current and next word, starts the transition animation.
   * Updates information about the "landed" letter for the next cycle.
   * Sets timer for the next word change.
   */
  const changeWord = async () => {
    const currentWordObject = valueWords[currentWordIndexRef.current];
    const currentWordBaseColor = currentWordObject.color;

    const selectionResult = getRandomWordWithCommonLetter(currentWordObject.text, currentWordBaseColor, lastBridgeCharRef.current);
    const nextWordObject = selectionResult.word;
    const commonLetterInfoForThisTransition = selectionResult.commonInfo;

    if (!nextWordObject) {
      // This case should ideally be handled by fallbacks in getRandomWordWithCommonLetter
      console.error("🚨 Critical: getRandomWordWithCommonLetter did not return a word. Resetting or retrying.");
      const newIndex = (currentWordIndexRef.current + 1) % valueWords.length;
      setCurrentWordIndex(newIndex); // Simple fallback
      currentWordIndexRef.current = newIndex;
      lastLandedBridgeInfoRef.current = null;
      setTimeout(changeWord, 1500);
      return;
    }

    // CRITICAL: This should never be null with our improved logic!
    if (!commonLetterInfoForThisTransition) {
      console.error(`🚨 CRITICAL BUG: No common letter found between "${currentWordObject.text}" and "${nextWordObject.text}"!`);
      console.error("🚨 This indicates a severe bug in getRandomWordWithCommonLetter function!");
      console.error("🚨 Falling back to simple transition, but this should be investigated!");
    }

    // Animate the transition using the determined commonLetterInfo (or null if none)
    await animateWordTransition(currentWordObject, nextWordObject, commonLetterInfoForThisTransition, currentWordBaseColor);

    // Update lastLandedBridgeInfo for the *next* cycle based on the transition that just happened
    if (commonLetterInfoForThisTransition) {
      lastLandedBridgeInfoRef.current = {
        char: commonLetterInfoForThisTransition.letter, // Already uppercase from findCommonLetters
        indexInCurrentWord: commonLetterInfoForThisTransition.positionInWord2 // This is index in newWordObject.text
      };
      lastBridgeCharRef.current = commonLetterInfoForThisTransition.letter;
    } else {
      lastLandedBridgeInfoRef.current = null;
    }

    // Update currentWordIndex to the new word
    const newIndex = valueWords.findIndex(w => w.text === nextWordObject.text);
    if (newIndex === -1) {
        console.error(`Could not find ${nextWordObject.text} in valueWords array. Resetting to 0.`);
        setCurrentWordIndex(0);
        currentWordIndexRef.current = 0;
        lastLandedBridgeInfoRef.current = null; // Reset if index is messed up
    } else {
        setCurrentWordIndex(newIndex);
        currentWordIndexRef.current = newIndex;
    }
    
    // Interval until next word change in this component.
    // Calculated for synchronization with other component (design.js).
    const nextInterval = 3000; 
    setTimeout(changeWord, nextInterval);
  };

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Anton:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Initial delay before first word change in this component.
    // "SOMETHING" should change first.
    const initialInterval = 1500; 
    const timer = setTimeout(changeWord, initialInterval);

    return () => {
      clearTimeout(timer);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="something-component">
      <SomethingStyles />
      <div className="something-wrapper">
        <div className="hero-word-container" ref={containerRef}>
          <span className="word-part" style={{ color: "#E0E3D8" }}>SOMETHING</span>
        </div>
      </div>
    </div>
  );
};

export default Something;