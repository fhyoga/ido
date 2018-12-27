import q5 from './';
describe('q5最长回文子串', () => {
  test('caba', () => {
    expect(q5('caba')).toBe('aba');
  });
  test('babad', () => {
    expect(q5('babad')).toBe('aba');
  });
  test('cbbd', () => {
    expect(q5('cbbd')).toBe('bb');
  });
});
