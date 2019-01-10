/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
  if (!root) {
    return [];
  }
  let stack = [];
  let res = [];
  while (root || stack.length) {
    if (root) {
      stack.push(root);
      res.push(root.val);
      root = root.left;
    } else {
      let node = stack.pop();
      root = node.right;
    }
  }

  return res
};

export default preorderTraversal;
