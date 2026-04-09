![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/mumuy/relationship/test.yml)

由于工作生活节奏不同，如今很多关系稍疏远的亲戚之间来往并不多。因此放假回家过年时，往往会搞不清楚哪位亲戚应该喊什么称呼，很是尴尬。然而搞不清亲戚关系和亲戚称谓的不仅是小孩，就连年轻一代的大人也都常常模糊混乱。

“中国家庭称谓计算器”为你避免了这种尴尬，只需简单的输入即可算出称谓。输入框兼容了不同的叫法，你可以称呼父亲为：“老爸”、“爹地”、“老爷子”等等，方便不同地域的习惯叫法。快捷输入按键，只需简单的点击即可完成关系输入，算法还支持逆向查找称呼哦～！

项目演示地址：[https://passer-by.com/relationship/](https://passer-by.com/relationship/)

移动版演示地址: [https://passer-by.com/relationship/vue/](https://passer-by.com/relationship/vue/)

## 一、下载 & 安装

脚本库可以用于浏览器，也可以用于 Nodejs 环境中。

1. 在网页中引入 `<script src="https://passer-by.com/relationship/dist/relationship.min.js">`

   获取全局方法 `relationship`
   
2. 使用 npm 安装名为 `relationship.js ` 的包

	> **npm install relationship.js**

	在脚本中引入模块

	```js
	// CommonJS 引入
	const relationship = require("relationship.js");
	```
	```js
	// ES Module 引入
 	import relationship from 'relationship.js';
	```
 	 ![npm](https://img.shields.io/npm/v/relationship.js)  ![npm](https://img.shields.io/npm/dw/relationship.js)

## 二、使用
1. 通用方法: 唯一的计算方法 `relationship`.
	
	* 选项模式 `relationship(options)`
	
	参数`options`结构为：
	
	```js
	var options = {
		text:'',				// 目标对象：目标对象的称谓汉字表达，称谓间用‘的’字分隔
		target:'',	    		// 相对对象：相对对象的称谓汉字表达，称谓间用‘的’字分隔，空表示自己
		sex:-1,					// 本人性别：0表示女性,1表示男性
		type:'default',			// 转换类型：'default'计算称谓,'chain'计算关系链,'pair'计算关系合称
		reverse:false,			// 称呼方式：true对方称呼我,false我称呼对方
		mode:'default',			// 模式选择：使用setMode方法定制不同地区模式，在此选择自定义模式
		optimal:false,       	// 最短关系：计算两者之间的最短关系
	};
	```
	
	代码示例：
	
	```js
	// 如：我应该叫外婆的哥哥什么？
	relationship({text:'妈妈的妈妈的哥哥'});
	// => ['舅外公']
	
	// 如：七舅姥爷应该叫我什么？
	relationship({text:'七舅姥爷',reverse:true,sex:1});
	// => ['甥外孙']
	
	// 如：舅公是什么亲戚
	relationship({text:'舅公',type:'chain'});
	// => ['爸爸的妈妈的兄弟', '妈妈的妈妈的兄弟', '老公的妈妈的兄弟']
	
	// 如：舅妈如何称呼外婆？
	relationship({text:'外婆',target:'舅妈',sex:1});
	// => ['婆婆']
	
	// 如：外婆和奶奶之间是什么关系？
	relationship({text:'外婆',target:'奶奶',type:'pair'});
	// => ['儿女亲家']
	```
	
	* 语句模式 `relationship(exptession)`
	
	参数`exptession`句式可以为：`xxx是xxx的什么人`、`xxx叫xxx什么`、`xxx如何称呼xxx`等.
	
	代码示例：
	
	```js
	// 如：舅妈如何称呼外婆？
	relationship('舅妈如何称呼外婆？');
	// => ['婆婆']
	
	// 如：外婆和奶奶之间是什么关系？
	relationship('外婆和奶奶之间是什么关系？');
	// => ['儿女亲家']
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


## 四、关于分歧

一些称呼存在南北方或地区差异，容易引起歧义，并不保证和你所处地区的称谓习惯一致。

部分称呼有多种关系且跨辈分。例如：
* 大爷：爷爷的哥哥 / 父亲的哥哥(北方)；
* 舅公：爸妈的舅舅 / 老公的舅舅；
* 伯公：爸妈的伯父 / 老公的伯父；
* 叔公：爸妈的叔叔 / 老公的叔叔；
* 姨公：爸妈的姨丈 / 老公的姨丈；
* 姨夫：姨妈的老公 / 姨子的老公；
* 姑夫：姑妈的老公 / 姑子的老公；
* 婶子：叔叔的老婆 / 叔子的老婆；
* 妗子：舅舅的老婆 / 舅子的老婆；

部分称呼以现代生活常见理解为主。例如：
* 媳妇：在古代或者北方地区指儿子的妻子，这里指自己的妻子(儿媳妇写作“息妇”)；
* 太太：一些地方指年长的妇人或曾祖父母，这里指自己的妻子；

## 五、教程

* [算法实现原理](https://github.com/mumuy/relationship/wiki/%E7%AE%97%E6%B3%95%E5%AE%9E%E7%8E%B0)

## 六、其他

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
