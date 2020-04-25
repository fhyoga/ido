function throttle(handle, delay) {
  let lock = false
  return function () {
    if (lock) return
    lock = true
    setTimeout(() => {
      handle.apply(this, arguments)
      lock = false
    }, delay)
  }
}

