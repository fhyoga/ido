Function.prototype.myApply = function(context = window, ...rest) {
  if (typeof this !== "function") {
    throw new Error("TypeError");
  }
  context.fn = this;
  let res = context.fn(...rest);
  delete context.fn;
  return res;
};
