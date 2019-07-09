var obj = new Proxy(
  {},
  {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log(`setting ${key}!`);
      return Reflect.set(target, key, value, receiver);
    },
  },
);
window.obj = obj;

import * as rrweb from "rrweb";
import RrwebPlayer from "rrweb-player";
let events = [];
rrweb.record({
  emit(event) {
    // 将 event 存入 events 数组中
    events.push(event);
  },
});
document.querySelector("#replay").addEventListener("click", () => {
  console.log(events);
  new RrwebPlayer({
    target: document.querySelector("#app"),
    data: {
      events,
      width: 800,
      height: 500,
    },
  });
});
