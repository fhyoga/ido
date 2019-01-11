/**
 * 输入水平顺序遍历数组，返回一个二叉树
 *
 * @param {*} arr
 * @returns Binary Tree
 */
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

/**
 * 对主体进行一系列顺序操作
 *
 * @param {*} ins 主体
 * @param {*} operations 操作
 * @param {*} params 传入参数
 */
export const performOperations = (ins, operations, params) => {
  return operations.reduce((acc, v, i) => {
    let res = ins[v](...params[i]);
    acc.push(res || res === 0 ? res : null);
    return acc;
  }, []);
};
