function renderRadio(arguments) {
  document.getElementById("target").innerHTML = `<input id='radio' type='radio' />`;
}
function checkRadio(arguments) {
  document.getElementById("radio").checked = true;
  console.log(1);
  Promise.resolve().then(() => {
    document.getElementById("radio").checked = false;
  });
}
renderRadio();
checkRadio();
