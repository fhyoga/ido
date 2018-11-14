/**
 * Definition for singly-linked list.
 **/
function ListNode(val) {
  this.val = val;
  this.next = null;
}
/*
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  let temp = 0;
  let carry = 0;
  let res = new ListNode(0);
  let curr = res;
  while (l1 || l2) {
    temp = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    if (temp > 9) {
      carry = 1;
      temp = temp - 10;
    } else {
      carry = 0;
    }
    curr.next = new ListNode(temp);
    curr = curr.next;
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }
  if (carry > 0) {
    curr.next = new ListNode(carry);
  }
  return res.next;
};
export default addTwoNumbers;
