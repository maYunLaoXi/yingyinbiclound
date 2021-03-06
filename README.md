# 影音笔小程序（为自己公众号开发的微信小程序）

> 个人公众号： 影音笔 <br />一个关于摄影的公众号，主要发表个人摄影博客，分享自己总结的摄影知识技巧。同时也会经常搞晒相活动，免费给粉丝冲印少量的摄影作品。（寄送也是免费，全是我一个人出资，只为将这份喜悦带给更多的人）
## 性质
纯个人项目，想法与PRD设计、UI设计、文稿内容、前后端代码逻辑等等。
欢迎交流，同时也欢迎交流摄影知识。详细设计可以看： [yingyinbi.com](http://www.yingyinbi.com/photo/minProgram/影音笔公众号设计及使用说明.html)



## 时间`2020-08-30` **开发完成**

小程序预览：

![小程序二维码](http://img.yingyinbi.com/public/other/zrmy7uj5cvse0m1v02kq78.jpg)



整个项目用到的东西： 

* 图片上传的压缩（小程序的api）
* 七牛云图片内容安全及图片存储
* 腾讯地图（用来快速设定收件地址）
* 文字内容安全（小程序云函数调用腾讯的api）
* [Want-weapp](https://vant-contrib.gitee.io/vant-weapp/#/quickstart)
* [colorUI](https://github.com/weilanwl/ColorUI)



技术：

* 云数据库的操作
* 瀑布流组件
* 类朋友圈组件
* CDN图片速度的优化



由于审核时发现个人类小程未开放用户自行发布内容，所以已将用户上传的 图片改为由后台审核，后台发布。配套的后台管理界面见[yingyinbiclound-console](https://github.com/maYunLaoXi/yingyinbiclound-console)。

后期可能会加入的功能： 

* 消息通知
* 关注用户
* 约拍活动

### 时间`2020-08-17`
开发进度： 一直在开发，每天晚上基本都会抽1个小时出来开发，周未全天。图片的上传和内容安全，文字内容安全已完成。
作品和参加活动的作品的展示都完成的差不多了。

再完善一个首页和点选的功能，打算提交发布了，到时候再邀请一些人来测试。第二个版本再公开使用。

预计在一个月内完成初发布


### 时间`2020-06-11`

开发进度： 最近不是太忙，但是在操作云数据库的时候遇到很多问题，导致开发进度比较慢。

当然，开发的时候也会遇到一些设计上的不足之处，也会同时改进。

接下来将着重开发活动参加相关的内容。

这个版本引入了： [腾讯位置服务](https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview)，自动识别用户在地图中所选的地址的省市区。key存放在miniprogram/account/lbs.qq.js

```javascript
// lbs.qq.js文件
export const libsKey = 'xxxxxxxx'
```



> ## 时间`2020-05-22`
>
> 开发进度： 加入了上传摄影图文作品的页面，选择的图片可以再次调整位置。作品上传至云存储。分类展示页打算自己做一个瀑布流，类似小红书那种。
>
> 自己给自己改了个需求： 本来是设计为只有我个人可以发图片博文的，现在改为所有用户都可以发（人工审核用户的作品）。
>
> 所以接下来要做的东西： 数据库的设计，包括用户数据、博文和每期活动收集的数据。



> ## 时间`2020-04-12`
> 
> 小程序还处于开发阶段，由于平时加班比较多，时间有限，进度比预期推后了好多

影音笔公众号： 

​	![](http://www.yingyinbi.com/assets/img/yingyinbi-qrcode.b61a0687.jpg)



## 参考文档

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

