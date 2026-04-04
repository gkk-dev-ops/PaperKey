import type { PhoneticProfile, CharacterToken } from '../types';

export const NATO_PROFILE: PhoneticProfile = {
  id: 'nato',
  label: 'NATO Phonetic Alphabet',
  locale: 'en',
  source: 'built-in',
  letters: {
    A: 'Alpha',
    B: 'Bravo',
    C: 'Charlie',
    D: 'Delta',
    E: 'Echo',
    F: 'Foxtrot',
    G: 'Golf',
    H: 'Hotel',
    I: 'India',
    J: 'Juliet',
    K: 'Kilo',
    L: 'Lima',
    M: 'Mike',
    N: 'November',
    O: 'Oscar',
    P: 'Papa',
    Q: 'Quebec',
    R: 'Romeo',
    S: 'Sierra',
    T: 'Tango',
    U: 'Uniform',
    V: 'Victor',
    W: 'Whiskey',
    X: 'X-ray',
    Y: 'Yankee',
    Z: 'Zulu',
  },
  digits: {
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
  },
  symbols: {
    '-': 'Hyphen',
    '_': 'Underscore',
    '.': 'Dot',
    ',': 'Comma',
    ':': 'Colon',
    ';': 'Semicolon',
    '/': 'Slash',
    '\\': 'Backslash',
    '@': 'At sign',
    '#': 'Hash',
    '!': 'Exclamation mark',
    '?': 'Question mark',
    '*': 'Asterisk',
    '+': 'Plus',
    '=': 'Equals',
    '(': 'Left parenthesis',
    ')': 'Right parenthesis',
    '[': 'Left bracket',
    ']': 'Right bracket',
    '{': 'Left brace',
    '}': 'Right brace',
    '%': 'Percent',
    '$': 'Dollar sign',
    '&': 'Ampersand',
    '"': 'Double quote',
    "'": 'Apostrophe',
    ' ': 'Space',
  },
};

export function tokenize(text: string, profile: PhoneticProfile): CharacterToken[] {
  return Array.from(text).map((char, index) => {
    return buildToken(char, index, profile);
  });
}

function buildToken(char: string, index: number, profile: PhoneticProfile): CharacterToken {
  if (char === ' ') {
    const word = profile.symbols[' '] ?? 'Space';
    return {
      index,
      raw: char,
      type: 'space',
      phonetic: word,
      spoken: word,
    };
  }

  const upper = char.toUpperCase();
  if (/[A-Z]/.test(upper) && char.match(/[a-zA-Z]/)) {
    const isUpper = char === upper;
    const word = profile.letters[upper];
    if (word) {
      const caseLabel = isUpper ? 'capital' : 'lowercase';
      return {
        index,
        raw: char,
        type: isUpper ? 'upper' : 'lower',
        phonetic: word,
        spoken: `${word} (${caseLabel} ${char})`,
        caseLabel,
      };
    }
  }

  if (/[0-9]/.test(char)) {
    const word = profile.digits[char];
    if (word) {
      return {
        index,
        raw: char,
        type: 'digit',
        phonetic: word,
        spoken: word,
      };
    }
  }

  const symWord = profile.symbols[char];
  if (symWord) {
    return {
      index,
      raw: char,
      type: 'symbol',
      phonetic: symWord,
      spoken: symWord,
    };
  }

  return {
    index,
    raw: char,
    type: 'unknown',
    spoken: `Unknown symbol (${char})`,
  };
}

export function getCharType(char: string): 'upper' | 'lower' | 'digit' | 'space' | 'symbol' | 'unknown' {
  if (char === ' ') return 'space';
  if (/[A-Z]/.test(char)) return 'upper';
  if (/[a-z]/.test(char)) return 'lower';
  if (/[0-9]/.test(char)) return 'digit';
  if (char.match(/[^a-zA-Z0-9]/)) return 'symbol';
  return 'unknown';
}
