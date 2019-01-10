import q144 from './';
import { gennerateBinaryTree } from '../helper';

describe('144. 二叉树的前序遍历', () => {
  test('[1,null,2,3]', () => {
    expect(q144(gennerateBinaryTree([1,null,2,3]))).toEqual([1,2,3]);
  });
})