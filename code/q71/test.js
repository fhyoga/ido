import q71 from './';
describe('简化路径', () => {
  test('/home/', () => {
    expect(q71('/home/')).toBe('/home');
  });
  test('/home/foo/./../', () => {
    expect(q71('/home/foo/./../')).toBe('/home');
  });
  test('/home/foo/', () => {
    expect(q71('/home/foo/')).toBe('/home/foo');
  });
  test('/', () => {
    expect(q71('/')).toBe('/');
  });
});
