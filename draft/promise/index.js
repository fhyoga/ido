export default class Promise1 {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }
  static Constant = {
    PENDING: "PENDING",
    FULFILLED: "FULFILLED",
    REJECTED: "REJECTED",
  };
  status = Promise1.Constant.PENDING;
  value = "";
  onFulfilledStack = [];
  onRejectedStack = [];
  resolve = val => {
    const run = () => {
      let { onFulfilledStack } = this;
      this.value = val;
      this.status = Promise1.Constant.FULFILLED;
      let cb = null;
      while ((cb = onFulfilledStack.shift())) {
        cb(val);
      }
    };
    setTimeout(run, 0);
  };
  reject = err => {
    let { onRejectedStack } = this;
    this.value = err;
    this.status = Promise1.Constant.REJECTED;
    let cb = null;
    while ((cb = onRejectedStack.shift())) {
      cb(err);
    }
  };
  then(handleFulfilled, handleRejected) {
    const { value, status, onFulfilledStack, onRejectedStack } = this;
    return new Promise1((onFulfilledNext, onRejectedNext) => {
      const onFulfilled = value => {
        let res = handleFulfilled(value);
        if (res instanceof Promise1) {
          res.then(onFulfilledNext, onRejectedNext);
        } else {
          onFulfilledNext(res);
        }
      };
      const onRejected = err => {
        if (handleRejected) {
          handleRejected(err);
        } else {
          onRejectedNext(err);
        }
      };
      switch (status) {
        case Promise1.Constant.PENDING:
          onFulfilledStack.push(onFulfilled);
          onRejectedStack.push(onRejected);
          break;
        case Promise1.Constant.FULFILLED:
          handle(value);
          break;
        case Promise1.Constant.REJECTED:
          onRejected(value);
          break;
      }
    });
  }
  catch(handle) {
    return this.then(null, handle);
  }
}
