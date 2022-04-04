[![Build Status](https://travis-ci.org/mumuy/relationship.svg?branch=gh-pages)](https://travis-ci.org/mumuy/relationship/)

由于工作生活节奏不同，如今很多关系稍疏远的亲戚之间来往并不多。因此放假回家过年时，往往会搞不清楚哪位亲戚应该喊什么称呼，很是尴尬。然而搞不清亲戚关系和亲戚称谓的不仅是小孩，就连年轻一代的大人也都常常模糊混乱。

“中国家庭称谓计算器”为你避免了这种尴尬，只需简单的输入即可算出称谓。输入框兼容了不同的叫法，你可以称呼父亲为：“老爸”、“爹地”、“老爷子”等等，方面不同地域的习惯叫法。快捷输入按键，只需简单的点击即可完成关系输入，算法还支持逆向查找称呼哦～！


演示地址：[https://passer-by.com/relationship/](http://passer-by.com/relationship/)

借助这套算法结合vue开发的APP: [https://passer-by.com/relationship/vue/](http://passer-by.com/relationship/vue/)

在微信中搜索“亲戚关系”，还可以体验小程序版本

![亲戚关系计算器](https://passer-by.com/relationship/image/qrcode.jpg)

## 一、下载 & 安装

该 Javascript 库 / 模块可以用于前端也可以用于后端 Nodejs 中。

1. 直接下载dist/relationship.min.js，然后使用 `<script>`标签引入，可以得到全局的方法 `relationship`.
2. 使用 npm 进行包管理，具体为：

	> **npm install relationship.js**

然后使用 `require` 引入模块

```js
var relationship = require("relationship.js");
```


## 二、使用
1. 通用方法: 唯一的计算方法 `relationship(options)`.

参数`options`结构为：

```js
var options = {
	text:'',		//目标对象：目标对象的称谓汉字表达，称谓间用‘的’字分隔
	target:'',	    	//相对对象：相对对象的称谓汉字表达，称谓间用‘的’字分隔，空表示自己
	sex:-1,			//本人性别：0表示女性,1表示男性
	type:'default',		//转换类型：'default'计算称谓,'chain'计算关系
	reverse:false,		//称呼方式：true对方称呼我,false我称呼对方
	mode:'default'		//模式选择：使用setMode方法定制不同地区模式，在此选择自定义模式
};
```

代码示例：

```js
// 如：我应该叫外婆的哥哥什么？
relationship({text:'妈妈的妈妈的哥哥'});

// 如：七舅姥爷应该叫我什么？
relationship({text:'七舅姥爷','reverse':true,'sex':1});

// 如：舅公和我是什么关系？
relationship({text:'舅公',sex:0,type:'chain'});

// 如：舅妈如何称呼外婆？
relationship({text:'外婆',target:'舅妈',sex:1});
```
2. 内部属性：获取当前数据表 `relationship.data`.

3. 内部属性：获取当前数据量 `relationship.dataCount`.

4. 内部方法：用户自定义模式 `relationship.setMode(mode_name,mode_data)`.

代码示例(可参考数据表格式对数据进行覆盖)：

```js
// 关系解析语法
// 【关系链】f:父,m:母,h:夫,w:妻,s:子,d:女,xb:兄弟,ob:兄,lb:弟,xs:姐妹,os:姐,ls:妹
// 【修饰符】 1:男性,0:女性,&o:年长,&l:年幼,#:隔断,[a|b]:并列
relationship.setMode('northern',{
	'm,f':['姥爷'],
	'm,m':['姥姥'],
	'm,xb,s&o':['表哥'],
	'm,xb,s&l':['表弟'],
});
```

## 三、开发 & 贡献

```sh
# 安装开发依赖
npm install

# build 模块: 将 relationship 打包压缩
npm run build

# 执行测试用例（可以在tests/test.js中完善测试用例）
npm test
```

直接浏览器打开 `index.html` 来在查看网页demo 或 访问[亲戚称呼计算器项目演示](https://passer-by.com/relationship/)


## 四、关于分歧

一些称呼存在南北方或地区差异，容易引起歧义，并不保证和你所处地区的称谓习惯一致。本程序默认以现代生活常见的理解为主。例如：
* 媳妇：在古代或者当今北方地区指儿子的妻子，这里指自己的妻子。
* 大爷：北方指父亲的哥哥，这里指爷爷的哥哥
* 太太：一些地方指年长的妇人，这里指自己的妻子

针对不同地区的使用习惯差异，你可以通过上述所说的自定义模式定制更符合自己习惯的版本。

## 五、其他

他们都在用：

查询网
http://www.ip138.com/chengwei/

在线查询网
http://qinshu.supfree.net/

在线工具
http://www.atool.org/relateship.php

有道语文达人
http://dict.youdao.com/k12yuwen/html/relation.html

小米MIUI系统计算器
http://www.miui.com/

小米MIUI网页版本
http://www.miui.com/zt/calculator2016/dist.php

符号库
http://www.fuhaoku.com/tool/qinqiguanxi.html
