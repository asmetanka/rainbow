// Transition logic extracted from something.html, simplified for Node testing

const DEFAULT_WORDS = [
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

function findCommonLetters(word1, word2, excludedInfo = null) {
  const letters1 = word1.toLowerCase().split("");
  const letters2 = word2.toLowerCase().split("");

  for (let i = 0; i < letters1.length; i++) {
    const c1 = letters1[i];
    if (
      excludedInfo &&
      c1 === excludedInfo.char.toLowerCase() &&
      i === excludedInfo.indexInCurrentWord
    ) {
      continue;
    }
    if (c1 !== " " && letters2.includes(c1)) {
      return {
        letter: word1.charAt(i).toUpperCase(),
        positionInWord1: i,
        positionInWord2: letters2.indexOf(c1)
      };
    }
  }
  return null;
}

function getRandomWordWithCommonLetter(
  currentWordText,
  excludeColor,
  excludedLetterInfo,
  words = DEFAULT_WORDS
) {
  const available = [];
  words.forEach(w => {
    if (w.color !== excludeColor && w.text !== currentWordText) {
      const commonInfo = findCommonLetters(
        currentWordText,
        w.text,
        excludedLetterInfo
      );
      if (commonInfo) {
        available.push({ word: w, commonInfo });
      }
    }
  });
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  const otherColor = words.filter(
    w => w.color !== excludeColor && w.text !== currentWordText
  );
  if (otherColor.length > 0) {
    return { word: otherColor[Math.floor(Math.random() * otherColor.length)], commonInfo: null };
  }
  const anyOther = words.filter(w => w.text !== currentWordText);
  if (anyOther.length > 0) {
    return { word: anyOther[Math.floor(Math.random() * anyOther.length)], commonInfo: null };
  }
  const currentData = words.find(w => w.text === currentWordText);
  return { word: currentData || words[0], commonInfo: null };
}

async function animateWordTransition(currentWordObj, newWordObj, commonLetterInfo) {
  if (commonLetterInfo) {
    const l1 = currentWordObj.text.charAt(commonLetterInfo.positionInWord1);
    const l2 = newWordObj.text.charAt(commonLetterInfo.positionInWord2);
    if (l1.toUpperCase() !== commonLetterInfo.letter || l1.toUpperCase() !== l2.toUpperCase()) {
      throw new Error("Invalid common letter info");
    }
    return { usedCommonLetter: true, letter: l1.toUpperCase() };
  }
  return { usedCommonLetter: false };
}

module.exports = {
  DEFAULT_WORDS,
  findCommonLetters,
  getRandomWordWithCommonLetter,
  animateWordTransition
};

