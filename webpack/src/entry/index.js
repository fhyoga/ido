import Dec from "../decorator/index";

@Dec
class Test {
  a = 1;
  foo = () => {
    console.log(this.a);
  };
}

let a = new Test();
a.foo();
let foo = a.foo;
foo();
a.bar();
console.log(a);

class child extends Test {
  ch = 3;
}

console.log(new child());
