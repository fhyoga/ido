require("./index.less");

// selector 弹窗内容选择器/dom节点[required] opts.close 关闭弹窗选择器[option]
// opts.confirm弹窗确认选择器[option] opts.confirmCb 弹窗确认回掉[option]
// opts.clearArea点击空白区关闭弹窗[option][default:false]
function pop(selector, opts) {
  if (!selector) {
    console.error("没有输入选择器");
    return;
  }

  //判断是否为dom节点
  var child;
  if (!opts) opts = {};
  this.__opts = opts;

  if (!!selector.nodeType) {
    child = selector;
  } else {
    if (/^\s*</g.test(selector)) {
      //简单判断是否为html片段
      child = document.createElement("div");
      child.innerHTML = selector;
    } else {
      child = document.querySelectorAll(selector)[0];
      if (!child) {
        console.error("无效的选择器:" + selector);
        return;
      }
    }
  }

  var _this = this;

  var parent = document.createElement("div");

  parent.classList.add("pop-container");
  parent.style.visibility = "hidden";
  parent.style.opacity = 0;

  child.classList.add("pop-body");
  child.style.display = "block";
  parent.appendChild(child);
  document.body.appendChild(parent);
  this.parent = parent;
  this.__body = child;

  this.__bindEvent();
}
pop.prototype.__bindEvent = function() {
  var _this = this;
  var opts = this.__opts;
  var child = this.__body;
  if (!!opts.close) {
    Array.prototype.forEach.call(
      this.parent.querySelectorAll(opts.close),
      function(ele, index) {
        ele.addEventListener("click", function() {
          _this.hide();
          opts.closeCb && opts.closeCb(_this, ele);
        });
      }
    );
  }

  if (!!opts.confirm) {
    Array.prototype.forEach.call(
      this.parent.querySelectorAll(opts.confirm),
      function(ele, index) {
        console.log(ele);
        ele.addEventListener("click", function() {
          opts.confirmCb && opts.confirmCb(_this);
        });
      }
    );
  }

  //点击空白区关闭弹窗
  if (opts.clearArea) {
    this.parent.addEventListener("click", function(evt) {
      _this.hide();
    });
    child.addEventListener("click", function(evt) {
      evt.stopPropagation();
    });
  }
};
pop.prototype.show = function() {
  this.parent.style.visibility = "visible";
  this.parent.style.opacity = 1;
};

pop.prototype.hide = function() {
  this.parent.style.visibility = "hidden";
  this.parent.style.opacity = 0;
};

pop.prototype.toggle = function() {
  if (this.parent.style.opacity === "0") {
    this.show();
  } else {
    this.hide();
  }
};

pop.prototype.dom = function() {
  return this.parent;
};

pop.prototype.distory = function() {
  this.parent.parentNode.removeChild(this.parent);
};
pop.prototype.rerender = function(html, opts) {
  if (!!opts) {
    this.__opts = opts;
  }
  this.__body.innerHTML = html;
  this.__bindEvent();
  return this;
};
module.exports = pop;
