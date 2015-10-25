---
layout: post
title: 如何在Amazon EC2中挂载EBS作为永久存储
tags: ebs ec2 cloud
categories: cloud
---

如何在Amazon AWS上申请EC2不再多说，很多前辈给出了教程，本文只说如何挂载那免费的30G EBS。我申请的一年的免费的32位Red Hat Enterprise Linux，详细参数：

```bash
Red Hat Enterprise Linux 6.4 - ami-80bbf3d2 (64-bit) / ami-9cbbf3ce (32-bit)
Red Hat Enterprise Linux version 6.4, EBS-boot.
Root device type: ebs Virtualization type: paravirtual
```

首先登陆[『AWS管理控制台』](http://console.aws.amazon.com/console/home)，进入[『EC2』](http://console.aws.amazon.com/ec2/v2/home)。

左侧树依次点击『ELASTIC BLOCK STORE』-『Volumes』，点击『Create Volume』创建一个新的volume。

> *   按照[AWS 免费套餐条款](http://aws.amazon.com/cn/free)，每月有30 GB 的 EBS 可用。但也没必要最大额，够用即可。
> *   Availability Zone要与你的主机实例在同一个区域，查看『INSTANCES』-『instances』列表中的Availability Zone选项。

创建完毕后，在左侧列表中选中右键Attach Volume，在Instances列表中选中你的Instance。在Device中输入设备名，如：**/dev/sdf**。

接下来用putty登陆进你的云主机，不会不知道怎么做吧。

```bash
login as: ec2-user
Authenticating with public key "imported-openssh-key"
Last login: Thu Jan  2 21:10:51 2014 from 219.133.173.33

[ec2-user@ip-172-32-11-222 ~]$ df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/xvde1            6.0G  1.7G  4.2G  29% /
none 
```

使用_df -h_看到确实没有新建的volume，这是正常的，因尚未挂载。

```bash
[ec2-user@ip-172-32-11-222 /]$ df -T
Filesystem    Type   1K-blocks      Used Available Use% Mounted on
/dev/xvde1    ext4     6193088   1892740   4237736  31% /
none         tmpfs      305112         0    305112   0% /dev/shm
```

用_df -T_查看当前系统的文件格式，为ext4。

```bash
[ec2-user@ip-172-32-11-222 /]$  mkfs.ext4 /dev/sdf
mke2fs 1.41.12 (17-May-2010)
Could not stat /dev/sdf --- No such file or directory

The device apparently does not exist; did you specify it correctly?
```

尝试根据当前文件系统来格式化新加的volume，报错没有文件，找不到设备？
可是我新创建的volume明明就是/dev/sdf啊，这是为什么？

```bash
[ec2-user@ip-172-32-11-222 /]$ sudo fdisk -l

Disk /dev/xvde1: 6442 MB, 6442450944 bytes
255 heads, 63 sectors/track, 783 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00000000

Disk /dev/xvdj: 10.7 GB, 10737418240 bytes
255 heads, 63 sectors/track, 1305 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00000000
```
用_fdisk -l_命令看下设备名，居然名字是**/dev/xvdj**。


```bash
[ec2-user@ip-172-32-11-222 /]$ sudo  mkfs.ext4 /dev/xvdj
mke2fs 1.41.12 (17-May-2010)
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
Stride=0 blocks, Stripe width=0 blocks
655360 inodes, 2621440 blocks
131072 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=2684354560
80 block groups
32768 blocks per group, 32768 fragments per group
8192 inodes per group
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632

```

格式化。下面创建挂载点，将新增的volumn挂在上。

```bash
[ec2-user@ip-172-32-11-222 /]$ sudo mkdir /mnt/ebs
[ec2-user@ip-172-32-11-222 /]$ sudo mount /dev/xvdj  /mnt/ebs
[ec2-user@ip-172-32-11-222 /]$ df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/xvde1            6.0G  1.9G  4.1G  31% /
none                  298M     0  298M   0% /dev/shm
/dev/xvdj             9.9G  151M  9.2G   2% /mnt/ebs
```

# 参考文献

[amazon ec2 - boto and attaching a ebs to ec2](http://stackoverflow.com/questions/13788619/boto-and-attaching-a-ebs-to-ec2-now-what)
[How to convert Amazon instance store EC2 to EBS based EC2](http://blog.sina.com.cn/s/blog_3d4a28be0101jc0h.html)
[调整amazon EC2云主机的EBS启动磁盘大小 ](http://blog.sina.com.cn/s/blog_704836f40101anhf.html)
[在EC2中使用EBS作为永久存储](http://www.storyday.com/html/y2011/2959_in-ec2-using-ebs-as-a-permanent-storage.html)
[在EC2中使用EBS作为永久存储](http://www.vmzj.com/212.html)
[linux查看硬盘使用情况命令](http://www.cnblogs.com/hopeworld/archive/2009/05/25/1488617.html)