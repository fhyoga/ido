/**
 * initialize your data structure here.
 */
var MinStack = function() {
  this.stack = [];
  this.minStack = [];
};

/**
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function(x) {
  let m = this.minStack;
  if (m.length) {
    let cMin = this.minStack[m.length - 1];
    cMin >= x ? m.push(x) : null;
  } else {
    m.push(x);
  }
  return this.stack.push(x);
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
  let v = this.stack.pop();
  v === this.minStack[this.minStack.length - 1] ? this.minStack.pop() : null;
  return v;
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
  return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
  return this.minStack[this.minStack.length - 1];
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = Object.create(MinStack).createNew()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */

// export default MinStack;

let s = new MinStack();
console.log('s.push(0): ', s.push(0));
console.log('s.push(1): ', s.push(1));
console.log('s.push(0): ', s.push(0));
console.log('s.getMin(): ', s.getMin());
console.log('s.pop(): ', s.pop());
console.log('s.getMin(): ', s.getMin());
