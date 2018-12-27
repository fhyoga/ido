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

  // 另一种
  // if (!s || s.length == 0) return 0;
  //   if (s.length == 1) return 1;
  //   var maxLen = 1;
  //   var start = 0;
  //   for (var i = 1; i < s.length; i++) {
  //   	var c = s[i];
  //   	var j = s.substring(start,i).indexOf(c)//在start-i前的字符串中找到是s[i],找不到返回-1,找到返回s从左数第一个字符
  //   	if(j>=0){
  //   		start +=j + 1;
  //   	}
  //   	else {
  //   		maxLen = Math.max(maxLen,i-start+1)
  //   	}
  //   }
  //   return maxLen;
};

export default lengthOfLongestSubstring;
