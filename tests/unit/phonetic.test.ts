import { describe, it, expect } from 'vitest';
import { NATO_PROFILE, tokenize, getCharType } from '../../src/lib/phonetic';

describe('NATO_PROFILE', () => {
  it('has all 26 letters', () => {
    expect(Object.keys(NATO_PROFILE.letters)).toHaveLength(26);
  });

  it('has all 10 digits', () => {
    expect(Object.keys(NATO_PROFILE.digits)).toHaveLength(10);
  });

  it('includes common symbols', () => {
    expect(NATO_PROFILE.symbols['-']).toBe('Hyphen');
    expect(NATO_PROFILE.symbols['_']).toBe('Underscore');
    expect(NATO_PROFILE.symbols['@']).toBe('At sign');
    expect(NATO_PROFILE.symbols[' ']).toBe('Space');
  });

  it('maps A to Alpha', () => {
    expect(NATO_PROFILE.letters['A']).toBe('Alpha');
  });

  it('maps Z to Zulu', () => {
    expect(NATO_PROFILE.letters['Z']).toBe('Zulu');
  });
});

describe('tokenize', () => {
  it('tokenizes uppercase letter correctly', () => {
    const tokens = tokenize('A', NATO_PROFILE);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('upper');
    expect(tokens[0].raw).toBe('A');
    expect(tokens[0].phonetic).toBe('Alpha');
    expect(tokens[0].spoken).toBe('Alpha (capital A)');
    expect(tokens[0].caseLabel).toBe('capital');
  });

  it('tokenizes lowercase letter correctly', () => {
    const tokens = tokenize('b', NATO_PROFILE);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('lower');
    expect(tokens[0].raw).toBe('b');
    expect(tokens[0].phonetic).toBe('Bravo');
    expect(tokens[0].spoken).toBe('Bravo (lowercase b)');
    expect(tokens[0].caseLabel).toBe('lowercase');
  });

  it('tokenizes digit correctly', () => {
    const tokens = tokenize('4', NATO_PROFILE);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('digit');
    expect(tokens[0].raw).toBe('4');
    expect(tokens[0].spoken).toBe('Four');
  });

  it('tokenizes space correctly', () => {
    const tokens = tokenize(' ', NATO_PROFILE);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('space');
    expect(tokens[0].spoken).toBe('Space');
  });

  it('tokenizes symbol correctly', () => {
    const tokens = tokenize('-', NATO_PROFILE);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('symbol');
    expect(tokens[0].spoken).toBe('Hyphen');
  });

  it('tokenizes unknown symbol', () => {
    const tokens = tokenize('€', NATO_PROFILE);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('unknown');
    expect(tokens[0].spoken).toContain('Unknown symbol');
    expect(tokens[0].spoken).toContain('€');
  });

  it('tokenizes a multi-character string', () => {
    const tokens = tokenize('Ab1', NATO_PROFILE);
    expect(tokens).toHaveLength(3);
    expect(tokens[0].type).toBe('upper');
    expect(tokens[1].type).toBe('lower');
    expect(tokens[2].type).toBe('digit');
  });

  it('sets correct indices', () => {
    const tokens = tokenize('abc', NATO_PROFILE);
    expect(tokens[0].index).toBe(0);
    expect(tokens[1].index).toBe(1);
    expect(tokens[2].index).toBe(2);
  });

  it('handles empty string', () => {
    const tokens = tokenize('', NATO_PROFILE);
    expect(tokens).toHaveLength(0);
  });
});

describe('getCharType', () => {
  it('identifies uppercase', () => {
    expect(getCharType('A')).toBe('upper');
    expect(getCharType('Z')).toBe('upper');
  });

  it('identifies lowercase', () => {
    expect(getCharType('a')).toBe('lower');
    expect(getCharType('z')).toBe('lower');
  });

  it('identifies digit', () => {
    expect(getCharType('0')).toBe('digit');
    expect(getCharType('9')).toBe('digit');
  });

  it('identifies space', () => {
    expect(getCharType(' ')).toBe('space');
  });

  it('identifies symbol', () => {
    expect(getCharType('-')).toBe('symbol');
    expect(getCharType('@')).toBe('symbol');
  });
});
