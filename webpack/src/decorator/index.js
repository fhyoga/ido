export default function(fn) {
  fn.prototype.bar = function() {
    console.log(this.a);
  };
  return fn;
}
