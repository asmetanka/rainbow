const { getRandomWordWithCommonLetter, animateWordTransition } = require('../src/transitions');

describe('getRandomWordWithCommonLetter', () => {
  test('prefers words sharing a letter', () => {
    const words = [
      { text: 'APPLE', color: '#fff' },
      { text: 'PLUM', color: '#000' },
      { text: 'ORANGE', color: '#333' }
    ];
    jest.spyOn(Math, 'random').mockReturnValue(0); // always select first candidate
    const result = getRandomWordWithCommonLetter('APPLE', '#fff', null, words);
    expect(result.word.text).toBe('PLUM');
    expect(result.commonInfo).not.toBeNull();
    Math.random.mockRestore();
  });
});

describe('animateWordTransition', () => {
  test('handles transition with common letter info', async () => {
    const currentWord = { text: 'FOO', color: '#fff' };
    const newWord = { text: 'OF', color: '#000' };
    const info = { letter: 'O', positionInWord1: 1, positionInWord2: 0 };
    const result = await animateWordTransition(currentWord, newWord, info);
    expect(result.usedCommonLetter).toBe(true);
  });

  test('handles transition without common letter', async () => {
    const currentWord = { text: 'FOO', color: '#fff' };
    const newWord = { text: 'BAR', color: '#000' };
    const result = await animateWordTransition(currentWord, newWord, null);
    expect(result.usedCommonLetter).toBe(false);
  });
});
