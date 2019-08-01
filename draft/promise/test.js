import Promise1 from "./index";
let a = new Promise1((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});
a.then(val => {
  console.log(val);
  return 2;
})
  .then(val => {
    console.log(val);
    return 3;
  })
  .then(val => {
    console.log(val);
    throw new TypeError('ss')
    return 4;
  })
  .then(val => {
    console.log(val);
    return new Promise1(resolve => {
      setTimeout(() => {
        resolve(5);
      }, 3000);
    });
  })
  .then(val => {
    console.log(val);
  })
  .catch(err => {
    console.log(err);
  });
