export default class Promise1 {
  constructor(executor) {
    executor(this.resolve, this.reject);
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
    this.status = Promise1.Constant.REJECTED;
  };
  then(handleFulfilled) {
    const { status, onFulfilledStack, onRejectedStack } = this;
    return new Promise1((onFulfilledNext, onRejectedNext) => {
      const onFulfilled = value => {
        let res = handleFulfilled(value);
        onFulfilledNext(res);
      };
      const onRejected = () => {
        handleRejected(value);
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
    this.rejectStack.push(handle);
  }
}
