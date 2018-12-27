// ==q1
import q1 from './index';
test('q1返回数组内相加等于目标数字的项的索引', () => {
  expect(q1([2, 7, 11, 15], 9)).toEqual([0, 1]);
});