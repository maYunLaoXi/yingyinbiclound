# 数据库设计

## 关系

## 各集合

命名规范： 小驼峰，如果是id，使用_ ,如`_id`，`active_id`

### 用户集合 `user_info`
| 字段 | 类型 | 中文 | 例子 |
| ---- | ---- | ---- | ---- |
| openid | String | 微信openid | （博主很懒还没写） |
| nickName |      | 微信nikName |      |
| gender |      |      |      |
| language | | | |
| city | | | |
| province | | | |
| country | | | |
| avatarUrl | | 微信头像 | |
| editName | | 本程序自定义名 | |
| wallImg | | 背景图片 | |
| address | | 用户设定的地址 | |
| message | |  | |
| createTime | | | |
| editTime | | | |

### 活动`activity`

| 字段             |      | 中文        |      |
| ---------------- | ---- | ----------- | ---- |
| name             |      | 中文名      |      |
| actName          |      | 英文名      |      |
| open             |      | 是否进行中  |      |
| version          |      | 期数/版本号 |      |
| Author           |      | 作者/发起人 |      |
| endTime          |      | 结束时间    |      |
| topImg           |      | 封面        |      |
| descriptionShort |      | 简介        |      |
| beginTime        |      | 开始时间    |      |
| Joiner           |      | 参与人数    |      |
| shower           |      | 买家秀人数  |      |

### 活动数据集合`activity-data`

| 字段        | 类型  | 中文           | 例子           |
| ----------- | ----- | -------------- | -------------- |
| name        |       | 中文名         |                |
| actName     |       | 英文名         |                |
| Title       |       | 标题（选填）   |                |
| version     |       | 期数           |                |
| openid      |       | 参与者openid   |                |
| show        |       | 是否可展示     |                |
| address     |       | 接收地址       |                |
| time        |       | 创建时间       |                |
| photo       |       | 参与图片       |                |
| article     |       | 内容（选填）   |                |
| showReceive | Array | 活动接收的内容表里的相应_id |                 |
| createTime |  |  | |
| editTime |  |  | |

### 活动“买家秀”`show-receive`

| 字段        | 类型 | 中文                   | 例子 |
| ----------- | ---- | ---------------------- | ---- |
| article     |      | 内容（选填）           |      |
| show        |      | 是否可展示             |      |
| photo       |      | 参与图片(可以直接拍)   |      |
| activity_id |      | 活动的id               |      |
| data_id     |      | Activity-data 的_id    |      |
| hideUser    |      | 展示是是否隐藏用户信息 |      |
| createTime  |      |                        |      |
| editTime    |      |                        |      |
| openid      |      |                        |      |
| check       |      |                        |      |

