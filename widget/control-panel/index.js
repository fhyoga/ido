require('./index.less');

var VConsole = require('vconsole/dist/vconsole.min');
var vConsole = new VConsole();

import JSONViewer from '../jsonmate/index.js';
require('../jsonmate/index.less');

var pop = require('../pop');
var popControl = new pop('.w-control-content', {
  clearArea: true,
});

$(function() {
  //控制台中json格式化
  $('.w-control-content .w-control-jsonmate').each(function() {
    var jsonViewer = new JSONViewer();
    $(this).append(jsonViewer.getContainer());
    var json = $(this).data('json');
    // if (util.checkType(json) || util.checkType(json, 'Array')) {
      jsonViewer.showJSON(json, null, 0);
    // }
  });

  //切换控制台
  $('.w-control-panel').on('click', () => {
    popControl.toggle();
  });

  //切换请求内容
  $('.w-control-content .w-control-title').on('click', function() {
    $(this)
      .siblings()
      .toggle();
  });

  //展示控制台
  let showControl = function() {
    $('html').addClass('showControl');
    $(document).off('click', bindControl);
  };

  //控制台事件
  let bindControl = function(e) {
    //将Event按位置顺序排序
    if (e.touches.length === 4) {
      let touches = Array.prototype.slice.call(e.touches);
      let bottomTouches = touches
        .sort(function(a, b) {
          return a.clientY - b.clientY;
        })
        .splice(2, 2)
        .sort(function(a, b) {
          return a.clientX - b.clientX;
        });
      let topTouches = touches.sort(function(a, b) {
        return a.clientX - b.clientX;
      });

      if (checkPos(topTouches.concat(bottomTouches))) {
        longPress(function() {
          showControl();
        }, 3000);
      } else {
        console.log('control=bad');
      }
    }
  };

  if (location.href.indexOf('m.tuipink.com') > -1) {
    $(document).on('touchstart', function(e) {
      bindControl(e);
    });
  } else {
    showControl();
  }

  //检查触摸事件位置
  function checkPos(touches) {
    const OFFSET = 200; //检测的误差偏移量
    let $h = $(window).height(),
      $w = $(window).width();
    let baseArr = [
      {
        x: 0,
        y: 0,
      },
      {
        x: $w,
        y: 0,
      },
      {
        x: 0,
        y: $h,
      },
      {
        x: $w,
        y: $h,
      },
    ];
    return touches.every(function(val, index) {
      return (
        val.clientX > baseArr[index]['x'] - OFFSET &&
        val.clientX < baseArr[index]['x'] + OFFSET &&
        val.clientY > baseArr[index]['y'] - OFFSET &&
        val.clientY < baseArr[index]['y'] + OFFSET
      );
    });
  }

  //监测长触摸事件
  function longPress(fn, delay) {
    let timer = null;
    timer = setTimeout(function() {
      fn();
    }, delay);
    document.addEventListener('touchend', function() {
      clearTimeout(timer);
    });
  }
});
