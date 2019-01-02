/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function(path) {
  let queue = [];
  path.split('/').forEach(v => {
    if (v === '.' || v === '') {
    } else if (v === '..') {
      queue.pop();
    } else {
      queue.push(v);
    }
  });
  if (queue.length) {
    return queue.reduce((acc, v) => {
      return (acc += `/${v}`);
    }, '');
  }
  return '/'
};
export default simplifyPath;
