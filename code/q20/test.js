import q20 from './';
describe('有效的括号', () => {
  test('{({[]})}', () => {
    expect(q20('{({[]})}')).toBe(true);
  });
  test('{({})', () => {
    expect(q20('{({})')).toBe(false);
  });
  test('{({})]', () => {
    expect(q20('{({})')).toBe(false);
  });
  test('', () => {
    expect(q20('')).toBe(true);
  });
  test('(()(', () => {
    expect(q20('(()(')).toBe(false);
  });
  test('(()]', () => {
    expect(q20('(()]')).toBe(false);
  });
  test('{{)}', () => {
    expect(q20('{{)}')).toBe(false);
  });
});
