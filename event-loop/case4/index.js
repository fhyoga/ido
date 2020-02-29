//渲染几次？

function renderRadio(arguments) {
  document.getElementById(
    "target"
  ).innerHTML = `<input id='radio' type='radio' />`;
}
function checkRadio(arguments) {
  document.getElementById("radio").checked = true;
  setTimeout(() => {
    document.getElementById("radio").checked = false;
  }, 0);
}
renderRadio();
checkRadio();

setTimeout(() => {
  console.log(2);
}, 2);

setTimeout(() => {
  console.log(1);
}, 1);

setTimeout(() => {
  console.log(0);
}, 0);
