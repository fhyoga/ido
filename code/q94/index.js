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

//  递归
// var inorderTraversal = function(root) {
//   let list = [];
//   if (root.left) {
//     list = list.concat(inorderTraversal(root.left));
//   }
//   if (root.val) {
//     list.push(root.val);
//   }
//   if (root.right) {
//     list = list.concat(inorderTraversal(root.right));
//   }
//   return list;
// };

// 栈
var inorderTraversal = function(root) {
  let list = [];
  let stack = [];
  if (!root) {
    return list;
  }
  while (root || stack.length) {
    if (root) {
      stack.push(root);
      root = root.left;
    } else {
      let node = stack.pop();
      list.push(node.val);
      root = node.right;
    }
  }

  return list;
};

export default inorderTraversal;
