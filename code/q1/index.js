/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  let map = new Map();
  let res = [];
  nums.forEach((v, i) => {
    let t = target - v;
    if (map.has(t)) {
      res.push(map.get(t), i);
    }
    map.set(v, i);
  });
  return res;
};

module.exports = twoSum;
