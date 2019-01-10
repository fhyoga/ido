import q103 from './';
import { gennerateBinaryTree } from '../helper';
describe('103. 二叉树的锯齿形层次遍历', () => {
  test('[3, 9, 20, null, null, 15, 7]', () => {
    expect(q103(gennerateBinaryTree([3, 9, 20, null, null, 15, 7]))).toEqual([[3], [20, 9], [15, 7]]);
  });
});
