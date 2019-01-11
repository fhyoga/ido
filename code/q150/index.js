/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
  if (!tokens.length) {
    return 0;
  }
  let stack = [];
  tokens.forEach(v => {
    if (/^[\*,\/,+,-]$/.test(v)) {
      let b = +stack.pop();
      let a = +stack.pop();
      let c = 0;
      switch (v) {
        case '+':
          c = a + b;
          break;
        case '-':
          c = a - b;
          break;
        case '*':
          c = a * b;
          break;
        case '/':
          c = parseInt(a / b);
          break;
      }
      stack.push(c);
      console.log(a, v, b, c);
    } else {
      stack.push(v);
    }
  });
  return stack[0];
};

export default evalRPN;
