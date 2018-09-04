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
      console.log('push');
      res.push(map.get(t), i);
    }
    console.log(t, map, map.has(t));
    map.set(v, i);
    console.log(res);
  });
  return res;
};

let arr = [2, 7, 11, 15];
target = 9;

var res = twoSum(arr, target);
console.log(res);
