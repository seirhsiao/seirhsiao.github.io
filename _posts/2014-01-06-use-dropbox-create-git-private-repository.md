---
layout: post
title: 使用Dropbox建立Git私有仓库
tags: Dropbox Git
categories: git
---

无论是小型的团队或是个人都有协同开发的需要，[GitHub](http://github.com)上提供了仓库但是必须是public的，对于暂不公开的代码，或自己的小实验室，怎么玩呢？
用 [Dropbox](http://www.dropbox.com) 是个很好的选择，我之前是直接同步workspace，但是换台机器直接打开经常会报错。还是用 [Git](http://git-scm.com) 管理吧，满足个人多台机器工作，同时也满足多人协同办公。

> 本文主要介绍 [Dropbox](http://www.dropbox.com) 作为 [Git](http://git-scm.com/book/zh) 私有仓库。你也可以使用其它云存储工具，如 [SkyDrive](http://skydrive.live.com)， [Google Drive](http://drive.google.com)等，或国内的[金山快盘](http://www.kuaipan.cn/)，[百度云盘](http://pan.baidu.com)，[360云盘](http://yunpan.360.cn)。对于源代码这些重要资料，我强烈推荐大家使用国外的云产品，百度云曾经丢过我的文件，实在信不过，只作为电影备份盘。
<a id="more"></a>

### 环境准备

*   安装 [Git客户端](http://git-scm.com/book/zh/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)*   [注册](https://db.tt/ALifTz8G)并安装 [Dropbox客户端](http://www.dropbox.com/downloading?src=index)

### 建立 Git Server

到你Dropbox中私有仓库的目标目录repository下，执行git init命令，注意加上bare参数，bare参数不会生成.git目录，而是把.git中的内容开放出来，你不会直接看到项目的源代码。

```bash
cd ~/Dropbox         #切换到Dropbox目录
nkdir repository     #建立仓库根目录
cd repository        #切换到仓库目录
mkdir ${PROJECT}.git #建立项目仓库，${PROJECT}替换为你的项目名称
cd ${PROJECT}.git    #切换到项目目录
git init --bare      #初始化为git repository，即git server端的资料
```

至此，仓库建立完毕。你可以使用eclipse连接git仓库，share你的project，进行代码开发。下面介绍通过命令行如何使用：

### 建立本地仓库
```bash
cd ~/workspace    #切换到工作空间
mkdir {PROJECT}   #建立项目目录
cd ${PROJECT}     #切换到项目目录
git init          #初始化]
```

### 链接到Git Server
```bash
git add
touch READM.md
git commit --all -m "Initial commit"
git remote add origin ~/Dropbox/repository/${PROJECT}.git/
git push origin master
```

OK。提交本地代码，执行：
```bash
git push origin maste
```

需要获取原创更新，执行：
```bash
git push origin maste
```

另外，如果在push时中遇到如下错误，是因为Git默认http post的缓存为1M，具体可以[参考](http://blog.chengyunfeng.com/?p=488)。

> Error writing request body to server

# 参考文献

[把Dropbox改造为Git私有仓库](http://weizhifeng.net/git-with-dropbox.html)
[使用 Git + Dropbox + SourceTree 做 Source Code Management](http://kenlai.logdown.com/posts/52372--git-dropbox-sourcetree-source-code-management)
[使用 Dropbox 作为 Git 私有仓库](http://blog.jimu.in/?p=11)
[Git教學：Git的遠端操作及利用Dropbox建立Server進行協同開發(Windows)](http://www.mrmu.com.tw/2011/05/06/git-using-dropbox-as-server)
[远端仓库初始化成裸仓库 git init —bare](http://blog.csdn.net/feizxiang3/article/details/8065506)
[GIT初始化—bare参数：git init &amp; git init —bare](http://hi.baidu.com/aatfjctoytaefkr/item/00c693450a5b36af60d7b93f)
[什么叫做bare repo?](http://www.cnblogs.com/bamanzi/archive/2012/08/15/git-hg-bare-repo.html)