/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  if (s.length % 2 == 1) {
    return false;
  }
  let queue = [];
  let startTagMap = {
    '[': 1,
    '{': 2,
    '(': 3
  };
  let endTagMap = {
    ']': 1,
    '}': 2,
    ')': 3
  };
  let isMatched = true;
  s.split('').forEach(v => {
    if (startTagMap[v]) {
      queue.push(v);
    } else {
      if (startTagMap[queue.pop()] !== endTagMap[v]) {
        isMatched = false;
      }
    }
  });
  if (!isMatched) {
    return false;
  }
  if (queue.length === 0) {
    return true;
  }

  return false;
};
export default isValid;
