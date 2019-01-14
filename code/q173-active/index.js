/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 */
var BSTIterator = function(root) {
  let list = [];
  let stack = [];
  // if (!root) {
  //   return list;
  // }
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

  this._iterator = list;
};

/**
 * @return the next smallest number
 * @return {number}
 */
BSTIterator.prototype.next = function() {
  return this._iterator.shift();
};

/**
 * @return whether we have a next smallest number
 * @return {boolean}
 */
BSTIterator.prototype.hasNext = function() {
  return this._iterator.length === 0 ? false : true;
};

/**
 * Your BSTIterator object will be instantiated and called as such:
 * var obj = Object.create(BSTIterator).createNew(root)
 * var param_1 = obj.next()
 * var param_2 = obj.hasNext()
 */
