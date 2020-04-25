// import Dec from "../decorator/index";

// @Dec
// class Test {
//   a = 1;
//   foo = () => {
//     console.log(this.a);
//   };
// }

// let a = new Test();
// a.foo();
// let foo = a.foo;
// foo();
// a.bar();
// console.log(a);

// class child extends Test {
//   ch = 3;
// }

// console.log(new child());

import { es } from '../lib/es'
import { mt1 } from '../lib/utils'
// var d = '../lib/common.js'
const { common } = require('../lib/common.js')
es()
mt1()
common()
