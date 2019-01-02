import q94 from './';
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}
describe('94. 二叉树的中序遍历', () => {
  test('[1,null,3,2]', () => {
    expect(q94({ val: 1, left: null, right: { val: 2, left: { val: 3, left: null, right: null } } })).toEqual([1, 3, 2]);
  });
});
