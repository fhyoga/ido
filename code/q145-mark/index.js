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

//  未通过
// var postorderTraversal = function(root) {
//   let stack = [];
//   let res = [];
//   let pre = null;
//   while (root || stack.length) {
//     if (root) {
//       if (pre === root.left || pre === root.right) {
//         res.push(root.val);
//         root = stack.pop();
//       } else {
//         stack.push(root);
//         root = root.left;
//       }
//     } else {
//       let node = stack.pop();
//       if (node.right) {
//         stack.push(node);
//         root = node.right;
//       } else {
//         res.push(node.val);
//         root = stack.pop();
//       }
//     }
//     pre = root;
//   }
//   return res;
// };

// 递归
var postorderTraversal = function(root) {
  let res = [];
  if (root) {
    res = res.concat(postorderTraversal(root.left));
    res = res.concat(postorderTraversal(root.right));
    res.push(root.val);
  } else {
    return res
  }
  return res;
};
export default postorderTraversal;
