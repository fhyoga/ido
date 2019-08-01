const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
class Promise1 {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }
  status = PENDING;
  value = null;
  resolvedCbQueue = [];
  rejectedCbQueue = [];
  resolve = value => {
    if (value instanceof Promise1) {
      value.then(this.resolve, this.reject);
    }
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      let cb = null;
      while ((cb = this.resolvedCbQueue.shift())) {
        this.value = cb(this.value);
      }
    }
  };
  reject = value => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.value = value;
      let cb = null;
      while ((cb = this.resolvedCbQueue.shift())) {
        try {
          cb(value);
        } catch (err) {
          this.value = err;
        }
      }
    }
  };
  then(onFulfilled, onRejected) {
    let promise2 = null;
    if (this.status === PENDING) {
      return (promise2 = new Promise1((resolve, reject) => {
        this.resolvedCbQueue.push(() => {
          try {
            const x = onFulfilled(this.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (r) {
            reject(r);
          }
        });

        this.rejectedCbQueue.push(() => {
          try {
            const x = onRejected(this.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (r) {
            reject(r);
          }
        });
      }));
    }
    if (that.state === RESOLVED) {
      return (promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onFulfilled(that.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (reason) {
            reject(reason);
          }
        });
      }));
    }
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}

function resolutionProcedure(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Error"));
  }
  if (x instanceof Promise1) {
    x.then(function(value) {
      resolutionProcedure(promise2, value, resolve, reject);
    }, reject);
  }
  let called = false;
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          },
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

export default Promise1;
