//渲染几次？

function renderRadio(arguments) {
  document.getElementById("target").innerHTML = `<input id='radio' type='radio' />`;
}
function checkRadio(arguments) {
  document.getElementById("radio").checked = true;
  console.log(1);
  setTimeout(() => {
    document.getElementById("radio").checked = false;
  }, 0);
}
renderRadio();
checkRadio();
