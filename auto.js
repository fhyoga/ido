auto.waitFor();
let appName = '极氪';

let packageName = getPackageName(appName);
app.launchPackage(packageName);

// 拉起双开
// text(appName).findOne(2000).parent().click();

// 签到
text('我的').waitFor();
text('我的').findOne().parent().parent().click();

console.log(1000);
let sign = text('签到').findOne(2000);
if (sign) {
  sign.parent().parent().click();
}

// 浏览内容
text('社区').findOne().parent().parent().click();
id('com.zeekrlife.mobile:id/rv').scrollable().scrollForward();
id('com.zeekrlife.mobile:id/article_view').find()[0].click();

// 点赞
id('com.zeekrlife.mobile:id/imgv_likes').bounds(526, 2256, 595, 2400).clickable().click();

// 分享
// 拉起菜单
className('ImageView').boundsInside(837, 0, 1069, 300).findOne().click();
// 复制链接
id('com.zeekrlife.mobile:id/ivIcon').bounds(842, 2033, 957, 2148).findOne().parent().click();

// 返回
id('com.zeekrlife.mobile:id/toolbar_left_imgv').clickable().click();

id('com.zeekrlife.mobile:id/rv').scrollable().scrollForward();
id('com.zeekrlife.mobile:id/article_view').find()[1].click();

// 点赞
id('com.zeekrlife.mobile:id/imgv_likes').bounds(526, 2256, 595, 2400).clickable().click();

// 分享
// 拉起菜单
className('ImageView').boundsInside(837, 0, 1069, 300).findOne().click();
// 复制链接
id('com.zeekrlife.mobile:id/ivIcon').bounds(842, 2033, 957, 2148).findOne().parent().click();

// 返回
id('com.zeekrlife.mobile:id/toolbar_left_imgv').clickable().click();

// 活动
text('发现').findOne().parent().parent().click();

setTimeout(() => {
  id('com.zeekrlife.mobile:id/iv_bg').findOne().parent().click();
  className('ImageView').bounds(939, 95, 1031, 222).waitFor();
  className('ImageView').bounds(939, 95, 1031, 222).findOne().click();
  setTimeout(() => {
    id('com.zeekrlife.mobile:id/ivIcon').waitFor();
    id('com.zeekrlife.mobile:id/ivIcon').find()[2].parent().click();
    text('取消').findOne().parent().parent().click();
    id('com.zeekrlife.mobile:id/toolbar_left_imgv').clickable().click();
  }, 1000);
}, 1000);


