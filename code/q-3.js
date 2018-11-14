/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  if (s.length < 2) {
    return s.length;
  }
  let map = new Map();
  let max = 0;
  for (let i = 0, j = s.length; i < j; i++) {
    let ss = s[i];
    if (map.has(ss)) {
      max = max > map.size ? max : map.size;

      let keys = map.keys();
      for (let key of keys) {
        map.delete(key);
        if (ss === key) {
          break;
        }
      }
    }
    map.set(ss, 1);

    if (i === j - 1) {
      max = max > map.size ? max : map.size;
    }
  }
  return max;
};

export default lengthOfLongestSubstring;
