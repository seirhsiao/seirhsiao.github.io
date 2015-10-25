---
author: Hsiao
layout: post
title:  "使用Github+Jekyll搭载个人博客"
date: 2014-05-21 13:22:39
categories: Course
comments: true
tags: git jekyll
thread: 2
---

前言：第一次搞git，也是第一次做Blog，忙了两天时间才把本博客建好，当然也学到了很多知识，作为开博第二篇，我将以 “使用Github+Jekyll搭载个人博客” 为题写篇教程纪念，也方便后来人查看。初入Git，如有不明或勘误之处，敬请指出，感谢！ 

**注：本教程适用于有编程经验的读者，同时了解html的读者会感到更加简单。**  
**注：本教程最后更正日期：2014-11-05**

**2015/9/20**更新：最近重新配置本地环境，Windows10系统下安装git/ruby等均为64位版本，均可正常使用。

---
---
##第一步：认识Git，GitHub Pages，Jekyll
---

1. 什么是Git？  
[Git](http://git-scm.com/)是一款自由和开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。

2. 什么是Github？  
[GitHub](http://github.com/)是一个面向开源及私有软件项目的托管平台，因为只支持Git作为唯一的版本库格式进行托管，故名GitHub。

3. 什么是GitHub Pages？  
[GitHub Pages](https://pages.github.com/)是一个更加专注于托管网页而非项目的免费平台，通过它我们可以快速而简单的发布我们的网站。

4. 什么是Jekyll？  
[Jekyll](http://jekyllrb.com/)官方解释为“Transform your plain text into static websites and blogs”，它是一个生成静态网页的工具，不需要数据库支持。但是可以配合第三方服务,例如discuz。最关键的是jekyll可以免费部署在Github上，而且可以绑定自己的域名。

了解了上面的知识，我们也就明白了 “使用Github+Jekyll搭载个人博客” 的原理。这里，我们选择利用*GitHub二级域名+本地命令行*方式搭载博客。实践证明命令行方式避免了很多如编码等问题。  
好了，废话不多说，Go！

---
##第二步：配置本地Git/Jekyll环境
---

我们完全可以把所有事情都放在GitHub上直接在线完成，当然为了更加自由和个性化以及其他某些原因，我们还应该在本地部署Git。  
我们需要下载的有[Git](http://git-scm.com/), 你可以直接进入<http://git-scm.com/downloads>选择需要的版本下载。这里我所用Git版本为windows下1.9.2版本。  
![GitDown](\images\2014-05-20-images\GitDown.jpg)  
![GitVersion](\images\2014-05-20-images\GitVersion.jpg)  
为了避免总是上传后再查看效果，我们希望可以在本地预览博客仅当我们感到满意时再上传至GitHub，这样我们还需要配置Jekyll环境。**依次**安装Ruby、Devkit、Jekyll。

这里最新版本为ruby-2.0.0-p481。我们可以直接进入<http://rubyinstaller.org/downloads/>选择需要的Ruby版本下载。**在安装时要勾选添加到环境变量**，也就是点选“Add Ruby executables to your PATH”。  
![RubyDown](\images\2014-05-20-images\RubyDown.jpg)
![RubyInstalll](\images\2014-05-20-images\RubyInstall.png)

接下来下载Devkit，还是进入刚才的[RubyInstaller](http://rubyinstaller.org/downloads/)下，如上面下载的Ruby为2.0.0版本，那么这里应该下载[DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe(32bits version only)](http://211.136.10.52/videoplayer/DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe?ich_u_r_i=30a965299eac270532859b718e57262a&ich_s_t_a_r_t=0&ich_e_n_d=0&ich_k_e_y=1445058920751663092446&ich_t_y_p_e=1&ich_d_i_s_k_i_d=4&ich_u_n_i_t=1)这个版本。如Ruby为其他版本，选择相应版本的Devkit下载。  
![DevkitDown](\images\2014-05-20-images\DevkitDown.jpg)

因为Jekyll是运行在ruby下，还需要配置ruby环境变量，但我们前面在安装Ruby时选择了 “Add Ruby executables to your PATH” ，所以不必担心这个问题，继续。(因为有人可能忘记了选择添加环境变量导致后面出错，再来提醒一次)

打开控制台窗口（开始->运行->cmd，windows8用户建议启用管理员权限），依次输入以下命令：
```bash
    $ cd C:\DevKit-mingw   //这里的“DevKit-mingw”要改成你自己的devkit所在目录

    $ ruby dk.rb init

    $ ruby dk.rb install
```
输入下面命令开始安装jekyll：
```bash
    $ gem install jekyll
```
另外额外安装rdiscount，用来解析markdown标记的解析包。
```bash
    $ gem install rdiscount
```
用查看版本号的方式检查jekyll是否安装完成：
```bash
    $ jekyll -v    // 或者 jekyll -version 或者 jekyll --version 都可以的
```
![JekyllVersion](\images\2014-05-20-images\JekyllVersion.png)

---
##第三步：这次真正要建立Blog了
---

首先，你需要一个GitHub账户，如果没有先进入<https://github.com/>注册，这里要注意一下，注册时“Pick a username”这个用户名也就是将来Blog的二级域名，也就是说将来的Blog域名为：username.giuhub.io，谨慎注册。建议用户名和邮箱名前缀相同，即username与username@somedomin.com

登陆Github，点击右上角或右下角+new repository  
![NewRepo1](\images\2014-05-20-images\NewRepo1.png)  
![NewRepo2](\images\2014-05-20-images\NewRepo2.png)  

 “Repository name” 填写 “username.github.io”， 这就是Blog主页，选上 “Initialize this repository with a README”  
![NewRepo](\images\2014-05-20-images\NewRepo.jpg)  
填好之后，Create！  
选择右边的 “Settings”  
![setting](\images\2014-05-20-images\setting.png)  
下拉，在GitHub Pages一栏点击 “Automatic page generator”，进去之后直接continue，确定就好。等大概几分钟应该就会生成个人Blog了，这时可以通过username.github.io进行访问。（由于某种博主暂时也不清楚的原因，我们需要先用GitHub Pages的自动生成器生成一个可见网页，然后才能利用jekyll。）（网上流传的包括Jekyll官网也声明需要在gh_pages分支才可以声明网页，但其实在master下也可以的。没有接触过git的读者可能不清楚分支是什么，新建的git仓库默认分支名称为master，也就是说我们这里一直在master里面工作，所以就算不明白也不必担心这个问题。）

接下来，在本地打开Git，利用 git clone 命令克隆git仓库，命令下的链接要改为自己在github下仓库的链接：
```bash
	$ git clone https://github.com/username/username.github.io
```
进入git仓库：
```bash
	$ cd username.github.io
```
设置全局用户名及邮箱：
```bash
	$ git config --global user.name "username"   //注册时填写的用户名
	$ git config --global user.email "username@somedomain.com"  //注册时填写的邮箱
```
这时如果熟悉html，你可以试着修改index.html内容，然后在git下执行命令
```bash
	$ git add --ignore-removal .	//将文件添加到缓存
	$ git commit -a -m "say something"    // 提交时应该写简要说明
	$ git push   // 正式提交。第一次使用git push命令可能会有提醒信息，回答即可。
```
这里给出官方中文的Git参考手册：<http://gitref.org/zh/index.html>  ，更多git命令及说明请自行百度。

至此完成了修改和提交的过程，以后每次写博文可以通过 本地修改+提交 或 直接GitHub在线写 即可。

---
##第四步：利用Jekyll及其他插件个性化Blog
---

细心的读者会发现，虽然我们已经花很长时间配置好了jekyll环境，但其实至此我们还完全没有用到Jekyll！

那么好，我们开始Jekyll化我们的博客，GitHub已经有很多精美的Jekyll主题，更重要的是这些是完全开源的。我们可以利用git clone命令克隆任何一个我们想要的主题，在知乎上也有关于jekyll主题的问题：<http://www.zhihu.com/question/20223939>，更多主题自行百度。

clone方法：你先要进入喜欢的主题博客，在页面最下面会有类似Powered by github，点击github就会进入博主的github，复制下链接，同样利用上一步的git clone命令就可以clone了~

成功clone后，可以把clone下来的文件拷到自己博客目录下，**当然一定要记得修改\_config\.yml等文件，同时记得删除原作者博文。**

插一段Jekyll网站的目录结构说明：  
一个基本的 Jekyll 网站的目录结构一般是像这样的：
```
	.
	├── _config.yml         //保存配置数据，clone后需要修改
	├── _drafts             //未发布的文章，clone后如果没有不用修改
	|   ├── begin-with-the-crazy-ideas.textile
	|   └── on-simplicity-in-technology.markdown
	├── _includes           //加载到layouts或posts中方便重用，clone后不建议修改
	|   ├── footer.html
	|   └── header.html
	├── _layouts            //包裹在文章外部的模板，clone后可以修改
	|   ├── default.html
	|   └── post.html
	├── _posts              //发布的文章，clone后需要删除里面内容
	|   ├── 2007-10-29-why-every-programmer-should-play-nethack.textile
	|   └── 2009-04-26-barcamp-boston-4-roundup.textile
	├── _site               //经过jekyll转换生成的页面，clone后不用修改
	└── index.html           //主页，clone后可以修改
```
来具体看看这些都有什么用：  
_config.yml  
保存配置数据。很多[配置](http://jekyllcn.com/docs/configuration/)选项都会直接从命令行中进行设置，但是如果你把那些配置写在这儿，你就不用非要去记住那些命令了。

_drafts  
drafts 是未发布的文章。这些文件的格式中都没有 title.MARKUP 数据。学习如何使用[drafts](http://jekyllcn.com/docs/drafts/)。

_includes  
你可以加载这些包含部分到你的布局或者文章中以方便重用。可以用这个标签  \{ % include file.ext %\} 来把文件 _includes/file.ext 包含进来。

_layouts  
layouts 是包裹在文章外部的模板。布局可以在[YAML头信息](http://jekyllcn.com/docs/frontmatter/)中根据不同文章进行选择。 这将在下一个部分进行介绍。标签 \{\{ content \}\} 可以将content插入页面中。

_posts  
这里放的就是你的文章了。文件格式很重要，必须要符合: YEAR-MONTH-DAY-title.MARKUP。 The [permalinks](http://jekyllcn.com/docs/permalinks/) 可以在文章中自己定制，但是数据和标记语言都是根据文件名来确定的。

_site  
一旦 Jekyll 完成转换，就会将生成的页面放在这里（默认）。最好将这个目录放进你的 .gitignore 文件中。

index.html and other HTML, Markdown, Textile files  
如果这些文件中包含[YAML头信息](http://jekyllcn.com/docs/frontmatter/)部分，Jekyll 就会自动将它们进行转换。当然，其他的如 xxx.html， xxx.markdown， xxx.md，或者 xxx.textile 等在你的站点根目录下或者不是以上提到的目录中的文件也会被转换。

Other Files/Folders  
其他一些未被提及的目录和文件如  css 还有 images 文件夹， favicon.ico 等文件都将被完全拷贝到生成的 site 中。 这里有一些使用 [Jekyll 的站点](http://jekyllcn.com/docs/sites/)，如果你感兴趣就来看看吧。

通过 clone 的方式会发现最终效果不尽人意，比如可能会失去坐着原有的博文评论功能，推荐用多说评论，或者 disqus，其中利用多说评论的方法很简单，只要把多说生成的一段代码拷到相应位置就OK。还有其他某些设置自己摸索着学习吧。

在本地预览效果利用 jekyll serve 命令，然后打开浏览器输入 [localhost:4000](localhost:4000) 就可以预览了（命令行可能会提示输入<http://0.0.0.0:4000/>或<http://127.0.0.1:4000/>，但实践证明是不能进入预览的）。
![JekyllServe](\images\2014-05-20-images\JekyllServe.png) 

效果满意之后就可以git add/commit/push ！

---
##附一：常见问题及解决方法
---

1. 中文乱码编码问题  
建议用命令行即Git Bash方式进行工作，不要用Git GUI，所有文本用utf-8编码，所有文件名用英文。  
中文乱码问题参考文章：  
<http://www.oschina.net/question/1396651_132154>  
<http://yanping.me/cn/blog/2012/10/09/chinese-charset-problems-with-jekyll/>

2. 预览时调用 jekyll serve 命令出错  
注意看错误提示，有可能是文件修改问题，比如没有修改好_config.yml文件，没有删除原博文，或者其他地方没有修改。  
也有可能是没有 gem install rdiscount。

3.使用gem install jekyll命令时出错，错误信息为：

	ERROR:  While executing gem ... (Gem::RemoteFetcher::FetchError)
    Errno::ECONNABORTED: An established connection was aborted by the software in your host machine. - SSL_connect (https://api.rubygems.org/specs.4.8.gz)

原因：由于国内某种原因gem可能被屏蔽。  
解决方法：切换gem源为国内源，比如淘宝的镜像(<http://ruby.taobao.org/>)很稳定。

---
##附二：参考资料
---

GitHub Pages Help：<https://help.github.com/categories/20/articles>

Git参考手册：<http://gitref.org/zh/index.html>

[将材柳裟](http://blog.jsfor.com/)的博文：[windows下本地jekyll博客搭建手记](http://blog.jsfor.com/skill/2013/09/07/jekyll-local-structures-notes/)

[阮一峰](http://www.ruanyifeng.com/)的博文：[搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)

[天镶](http://skyinlayer.com/)的博文：[使用jekyll搭建github博客系列](http://skyinlayer.com/#/art/blog/2014/02/06/jekyll-4)