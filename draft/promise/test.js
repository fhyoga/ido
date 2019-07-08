import Promise1 from "./index";
let a = new Promise1((resolve, reject) => {
  throw new Error(1);
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
  })
  .then(val => {
    console.log(3);
    return new Promise1(resolve => {
      setTimeout(() => {
        resolve(4);
      }, 3000);
    });
  })
  .then(val => {
    console.log(val);
  })
  .catch(err => {
    console.log(err);
  });
