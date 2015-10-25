---
layout: post
title: ZooKeeper 简介
tags: java zookeeper distribution
categories: bigdata
---

系统越来越大后切分出的模块越来越多，一些模块还部署了双机。配置文件混乱，更新部署极易出错，准备上 [zookeeper](http://zookeeper.apache.org)。

下载当前稳定版的 [zookeeper](http://zookeeper.apache.org/releases.html)，解压并拷贝 conf/zoo_sample.cfg 为 zoo.cfg，配置所需要的项目。最少配是只指定其中的 dataDir 项，其他项则使用默认值。

```
tickTime=2000        # 心跳基本时间单位，毫秒级，zk基本上所有时间都是这个时间的整数倍
clientPort=2181      # 监听客户端连接的端口
dataDir=/zookeeper/server0/data         # 内存数据库快照存放地址
dataLogDir=/zookeeper/server0/dataLog   # 事务日志存放地址，未指定则同dataDir项，建议分开
```

## 主要配置项说明

### 最小配置

最小配是保证zk正常运行必不可少的配置项。

*   **clientPort**：监听客户端连接的服务端口
*   **dataDir**：内存数据库快照地址，事务日志地址（除非由 dataLogDir 另行指定）
*   **tickTime**：毫秒级的基本时间单位，其他时间如心跳/超时等都为该单位时间的整数倍
> 建议另行指定 dataLogDir，以便将事务日志存储在单独的路径下，这很重要，因事物日志存储的设备效率直接影响zk的性能。

### 高级配置

高级参数是可选的，可以通过这些参数调优zk性能。有些参数还可以通过 java system properties 动态指定，格式为 zookeeper.keyword 。

*   **dataLogDir**：事务日志目录，可以使用专用的设备，以避免事务日志与快照之间的竞争。(No Java system property)
*   **globalOutstandingLimit**：zk接收的请求队列大小，默认1000，设置太大对导致内存溢出。(Java system property: zookeeper.globalOutstandingLimit)
*   **preAllocSize**：预先分配事务日志空间块，单位kb，默认64M。如果快照写入很频繁，减少这个值，参考 snapCount。 (Java system property: zookeeper.preAllocSize)
*   **snapCount**：每当 snapCount 个事物日志写入时，快照被创建，同时创建新的事务日志文件，默认值100,000。(Java system property: zookeeper.snapCount)

垃圾清理参数

*   **autopurge.purgeInterval**：清理频率，单位小时，默认0，表示不开启清理功能。
*   **autopurge.snapRetainCount**：需要保留的文件数目，默认是保留3个。

### 集群配置

*   **electionAlg**：领导选举算法，默认3。(No Java system property)
*   **initLimit**：tickTime的倍数，表示leader选举结束后，followers与leader同步需要的时间，leader的数据非常多时或followers比较多，则该值应该适当大一些。(No Java system property)
*   **syncLimit**：tickTime的倍数，表示follower和observer与leader交互时的最大等待时间，只不过是在与leader同步完毕之后，正常请求转发或ping等消息交互时的超时时间。(No Java system property)
*   **server.x**=[hostname]:nnnnn[:nnnnn], etc
集群配置中，在dataDir目录下必须有一个myid文件，其中的值就是数字x，范围是1-255。第一个nnnnn是与leader通讯使用，第二个nnnnn是选举leader使用，electionAlg等于0时不需要此参数。(No Java system property)

集群配置的例子
conf下的zoo.cfg文件：

```
server.1=127.0.0.1:12888:13888
server.2=127.0.0.1:22888:23888
server.3=127.0.0.1:32888:33888

```

dataDir下的myid文件：
```
1
```

> 更多参数参考 [ZK Administrator’s Guide](http://zookeeper.apache.org/doc/trunk/zookeeperAdmin.html)、[ZK 配置项详解](http://blog.csdn.net/lovingprince/article/details/6853753)、[ZK 配置文件](http://www.udpwork.com/item/2002.html) 或 [ZK 管理员指南](http://nileader.blog.51cto.com/1381108/1032157)。

## Java API

zk 官方的Java API是非常难用的，建议使用第三方基于官方API封装的工具包。

*   Netflix curator：[http://github.com/Netflix/curator](http://github.com/Netflix/curator)（强大）
*   sgroschupf zkclient：[http://github.com/sgroschupf/zkclient](http://github.com/sgroschupf/zkclient)（简单）
*   adyliu zkclient：[http://github.com/adyliu/zkclient](http://github.com/adyliu/zkclient)（极简）

看一下官方API的主要接口：

```java
public ZooKeeper(String connectString, int sessionTimeout, Watcher watcher) 
   throws IOException
```

*   connectString：逗号分隔，如localhost:2181,127.0.0.1:2181，zk会选出一个建立连接
*   sessionTimeout：session超时时间
*   watcher：回调函数
> 该方法是非阻塞的，如果需要阻塞，可以在Watcher中自己处理。
```java
public String create(String path, byte data[], List<ACL> acl, CreateMode createMode)
   throws KeeperException, InterruptedException
</span> <span class="line">- path：znode路径</span> <span class="line">- data：znode上的数据</span> <span class="line">- acl：权限信息, 如果不想指定权限, 可传入org.*.ZooDefs.Ids.OPEN_ACL_UNSAFE。</span> <span class="line">- createMode：枚举类CreateMode，PERSISTENT / PERSISTENT_SEQUENTIAL / EPHEMERAL / EPHEMERAL_SEQUENTIAL</span> <span class="line"></span> <span class="line">java
public List<String> getChildren(final String path, Watcher watcher)
   throws KeeperException, InterruptedException
```
*   path：znode路径
*   watcher：回调函数
> 监听 path node 自身的删除事件，以及 children nodes 的创建/删除事件。

```java
public Stat exists(final String path, Watcher watcher)
   throws KeeperException, InterruptedException
```
</pre></td></tr></table></figure>
> 监听 path node 自身的创建/删除/数据更新事件，path 不存在返回 null。
```java
public byte[] getData(final String path, Watcher watcher, Stat stat)
   throws KeeperException, InterruptedException
```
> 监听 path node 的删除/数据更新事件, 注意, 不监听 path node 的创建事件。stat 是传出参数，返回当前节点状态。
```java
public Stat setData(final String path, byte data[], int version)
   throws KeeperException, InterruptedException
```
> version 参数指定要更新数据的当前版本, 就是stats中的 version 值，如果和现有版本不匹配, 更新操作将失败。指定 version 为-1则忽略版本检查。
```java
public void delete(final String path, int version)
   throws InterruptedException, KeeperException
```

总结：

> getChildren， getData， exists 方法可指定是否监听相应的事件；而create，delete，setData 方法则会触发相应的事件。

## 权限设置
```java
// new一个acl
List<ACL> acls = new ArrayList<ACL>();
// 添加第一个id，采用用户名密码形式
Id id1 = new Id("digest", DigestAuthenticationProvider.generateDigest("admin:admin"));
ACL acl1 = new ACL(ZooDefs.Perms.ALL, id1);
acls.add(acl1);
// 添加第二个id，所有用户可读权限
Id id2 = new Id("world", "anyone");
ACL acl2 = new ACL(ZooDefs.Perms.READ, id2);
acls.add(acl2);

// zk用admin认证，创建/buru ZNode。
final ZooKeeper zk = new ZooKeeper("localhost:2181,127.0.0.1:2181", 2000, null);
zk.addAuthInfo("digest", "admin:admin".getBytes());

Stat exists = zk.exists("/buru", true);
if (exists != null)
   zk.setData("/buru", "2323".getBytes(), -1);
else
   zk.create("/buru", "data112".getBytes(), acls, CreateMode.PERSISTENT);
```
更多内容参考文章， [ZK 权限配置](http://nettm.iteye.com/blog/1721778)、[ZK ACL使用](http://www.cnblogs.com/wangxiaowei/p/3315137.html)、[ZK 权限控制](http://nileader.blog.51cto.com/1381108/795525) 或 [说说Zookeeper中的ACL](http://www.wuzesheng.com/?p=2438)。

## 管理工具

很可惜，没有顺手的，试试下面几个吧！

*   [ZooInspector](http://issues.apache.org/jira/secure/attachment/12436620/ZooInspector.zip)*   [ZooInspector 改进版](http://github.com/nettm/ZooInspector)
*   [node-zk-browser](http://github.com/killme2008/node-zk-browser)
*   [Node_Zookeeper_Admin](http://git.oschina.net/gznofeng/Node_Zookeeper_Admin)
*   [taokeeper](http://jm-blog.aliapp.com/?p=1450)
*   [zookeepercontroller](http://github.com/ryuubaishi/zookeepercontroller)