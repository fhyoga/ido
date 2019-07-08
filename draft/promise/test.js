import Promise1 from "./index";
let a = new Promise1((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 3000);
});
a.then(val => {
  console.log(val);
  return 2;
}).then(val => {
  console.log(val);
});
