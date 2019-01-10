import q145 from './';
import { gennerateBinaryTree } from '../helper';
describe('145. 二叉树的后序遍历', () => {
  test('[1,null,2,3]', () => {
    expect(q145(gennerateBinaryTree([1, null, 2, 3]))).toEqual([3, 2, 1]);
  });
});
