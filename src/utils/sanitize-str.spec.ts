import { sanitizeStr } from './sanitize-str';

describe('sanitizeStr', () => {
  it('should trim and normalize the string', () => {
    const input = '  Hello World!  ';
    const expectedOutput = 'Hello World!';
    expect(sanitizeStr(input)).toBe(expectedOutput);
  });

  it('should return an empty string if the input is not a string', () => {
    expect(sanitizeStr(123 as unknown as string)).toBe('');
    expect(sanitizeStr(null as unknown as string)).toBe('');
    expect(sanitizeStr(undefined as unknown as string)).toBe('');
  });

  it('should handle empty strings', () => {
    expect(sanitizeStr('')).toBe('');
    expect(sanitizeStr('   ')).toBe('');
  });

  it('should normalize Unicode characters', () => {
    const input = 'Café';
    const expectedOutput = 'Café';
    expect(sanitizeStr(input)).toBe(expectedOutput);
  });
});
