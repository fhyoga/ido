export const gennerateBinaryTree = arr => {
  if (!arr.length) {
    return null;
  }
  let queue = [];
  let root = {
    val: arr[0]
  };
  queue.push(root);
  let index = 1;
  while (index < arr.length) {
    let node = queue.shift();
    let lf = arr[index++];
    let rg = arr[index++];
    if (lf) {
      node.left = {
        val: lf
      };
      queue.push(node.left);
    }
    if (rg) {
      node.right = {
        val: rg
      };
      queue.push(node.right);
    }
  }

  return root;
};
