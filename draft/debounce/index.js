function debounce(handle, delay) {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => handle(), delay)
  }
}

function foo() {
  console.log('foo')
}

const test = debounce(foo, 1000)

setInterval(test, 200)
