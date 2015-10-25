---
layout: post
title: 建造可迁移的eclipse工作空间
tags: eclipse green java
categories: eclipse
---

为便于在各种机器和工作地点之间方便的迁移，我喜欢打造自己的绿色工作台，可谓有绿癖。
我的eclipse空间一般弄成如下目录结构（其它开发工具我也喜欢这么弄）：

```
.
├── eclipse.bat                   #一键启动
├── workspace                     #工作空间
├── ...                           #其他必要文件，如jdk，maven等
└── eclipse-jee-kepler-SR1-win32  #eclipse目录
    └── eclipse.exe               #eclipse启动文件
```

<a id="more"></a>

eclipse.bat采用相对路径启动eclipse.exe：

```
@echo off
start ./eclipse-jee-kepler-SR1-win32/eclipse.exe
```

eclipse的workspace也要设置成相对路径：

```
./workspace

```

![相对路径](http://bruce.u.qiniudn.com/2013/12/16/eclipse-workspace-relative-path.jpg)

> win7下『_./_』代表当前目录，『_../_』代表当前目录父目录，『_/_』代表盘符根目录。