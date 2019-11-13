Function.prototype.myBind = function(context = window, ...rest) {
  if (typeof this !== "function") {
    throw new Error("TypeError");
  }
  let _this = this;
  return function F(...innerRest) {
    if (this instanceof F) {
      return _this([...rest, ...innerRest]);
    }
    return _this.myApply(context, [...rest, ...innerRest]);
  };
};
