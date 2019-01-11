import q155 from './';
import { performOperations } from '../helper';
describe('155. 最小栈', () => {
  test('["push","push","push","getMin","pop","top","getMin"],[[-2],[0],[-3],[],[],[],[]]', () => {
    expect(performOperations(new q155(), ['push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], [[-2], [0], [-3], [], [], [], []])).toEqual([
      null,
      null,
      null,
      -3,
      null,
      0,
      -2
    ]);
  });
});
