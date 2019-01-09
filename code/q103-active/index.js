/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var zigzagLevelOrder = function(root) {
  if (!root) {
    return [];
  }
  let queue = [];
  let res = [];
  let level = 1;
  queue.push(root);
  while (queue.length) {
    let restCount = queue.length;
    let levelRes = [];
    while (restCount > 0) {
      let node = queue.shift();
      if (level % 2 === 0) {
        levelRes.unshift(node.val);
      } else {
        levelRes.push(node.val);
      }
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
      restCount--;
    }
    level++;
    res.push(levelRes);
  }

  return res
};
export default zigzagLevelOrder;
