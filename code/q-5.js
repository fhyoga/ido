/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
  let n = s.length;
  let res = [];
  let arr = [];
  let max = 0;
  for (let i = 0; i < n; i++) {
    arr[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      if (s[i] === getReverseStrByIndex(j)) {
        if (i == 0 || j == 0) {
          arr[i][j] = 1;
        } else {
          arr[i][j] = arr[i - 1][j - 1] + 1;
          if (max <= arr[i][j]) {
            // 如果反转后的子串结束索引等于原始索引，才是回文子串
            let len = arr[i][j];
            let startIndex = i - len + 1;
            let reverseS = j - len + 1;
            if (n - reverseS - 1 === i && n - j - 1 === startIndex) {
              res = [];
              max = arr[i][j];
              res.push(i - max + 1);
            }
          }
        }
      } else {
        arr[i][j] = 0;
      }
    }
  }

  return s.substr([res[0]], max) || s[0];

  function getReverseStrByIndex(i) {
    return s[n - i - 1];
  }
};

export default longestPalindrome;
