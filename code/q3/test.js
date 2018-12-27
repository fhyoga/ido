import q3 from './';

describe('q3无重复字符的最长子串', () => {
  test('abcabcdbb', () => {
    expect(q3('abcabcdbb')).toBe(4);
  });
  test('d', () => {
    expect(q3(' ')).toBe(1);
  });
  test('空白', () => {
    expect(q3('')).toBe(0);
  });
  test('au', () => {
    expect(q3('au')).toBe(2);
  });
  test('dvdf', () => {
    expect(q3('dvdf')).toBe(3);
  });
});
