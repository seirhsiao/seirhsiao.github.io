---
layout: post
title: Akka 快速入门
tags: akka scala
categories: scala
---

Akka的优点太多，高性能、高可靠、高并发、分布式、可容错、可扩展、事件驱动，不一一叙述。不同版本的API差异很大，本文代码运行在 [Scala 2.10.3](http://www.scala-lang.org) 和 [Akka 2.3.2](http://akka.io) 之上。
```xml
<dependency>
  <groupId>com.typesafe.akka</groupId>
  <artifactId>akka-actor_2.10</artifactId>
  <version>2.3.2</version>
</dependency>
<dependency>
  <groupId>org.scala-lang</groupId>
  <artifactId>scala-library</artifactId>
  <version>2.10.3</version>
</dependency>
```

# 定义

定义Actor很简单，继承 akka.actor.Actor ，实现receive方法即可。

```scala
val system = ActorSystem("HelloSystem")
val hello = system.actorOf(Props[Hello], name = "hello")
val hello1 = system.actorOf(Props[Hello])
val hello2 = system.actorOf(Props(new Hello()))
```
<a id="more"></a>

# 启动

创建Actor实例需要通过 ActorSystem 。

```scala
val system = ActorSystem("HelloSystem")
val hello = system.actorOf(Props[Hello], name = "hello")
val hello1 = system.actorOf(Props[Hello])
val hello2 = system.actorOf(Props(new Hello()))
```

如果要在 Actor 中继续创建子 Actor，需要使用内置的 ActorContext 对象。

```scala
context.actorOf(Props[children], name = "children")
```

如果要创建远程 Actor，需要通过 actorSelection 方法，原 actorFor 方法不再使用。

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line">context.actorSelection(<span class="string">"akka.tcp://HelloRemoteSystem@127.0.0.1:5150/user/RemoteActor"</span>)</span>
</pre></td></tr></table></figure>

# 发消息

巨简单，就是一个!，可以发送任意类型的消息，此消息是异步的。

```scala
context.actorSelection("akka.tcp://HelloRemoteSystem@127.0.0.1:5150/user/RemoteActor")
```
同步消息的发送需要使用 Future 对象。

```scala
implicit val timeout = Timeout(5 seconds)
val future = hello ? "sha"
val result = Await.result(future, timeout.duration).asInstanceOf[String]
```

# 停止

有两种方式停止一个Actor。

一种是通过内部 ActorContext.stop() 方法，该方法会将 children actor 逐层杀掉后，再自刎。

```scala
def receive = {
    case "stop" => context.stop(self)
    ...
  }
```

另一种是外部喂毒药，通过 ActorRef.tell() 方法实现。后一个参数是向谁reply，这里显然不需要，传空。

```scala
hello.tell(PoisonPill.getInstance, ActorRef.noSender);
```

# 哼哈示例
> 哼哈二将本是两位佛寺的门神俗称，是执金刚神的一种。明代小说《封神演义》作者陈仲琳据此附会两员神将，形象威武凶猛。一名郑伦，能鼻哼白气制敌；一名陈奇，能口哈黄气擒将。
```scala
hello.tell(PoisonPill.getInstance, ActorRef.noSender);
```

Run 起来，结果：

```erlang
哼
哈
哼
哈
哼
...
```

# 远程示例

### local工程

application.conf
```
akka {
  loglevel = "DEBUG"
  actor {
    provider = "akka.remote.RemoteActorRefProvider"
  }
  remote {
    enabled-transports = ["akka.remote.netty.tcp"]
    netty.tcp {
      hostname = "127.0.0.1"
      port = 5155
    }
 }
}
```
```scala
object Local extends App {
  val system = ActorSystem("LocalSystem")
  val localActor = system.actorOf(Props[LocalActor], name = "LocalActor") // the local actor
  localActor ! "START" // start the action
}
```

### remote工程

application.conf
```
akka {
  loglevel = "DEBUG"
  actor {
    provider = "akka.remote.RemoteActorRefProvider"
  }
  remote {
    enabled-transports = ["akka.remote.netty.tcp"]
    netty.tcp {
      hostname = "127.0.0.1"
      port = 5150
    }
 }
}
```

```scala
object HelloRemote extends App {
  val system = ActorSystem("HelloRemoteSystem")
  val remoteActor = system.actorOf(Props[RemoteActor], name = "RemoteActor")

  remoteActor ! "The RemoteActor is alive"
}
```
```scala
class RemoteActor extends Actor {
  def receive = {
    case msg: String =>
      println(s"RemoteActor received message '$msg'")
      sender ! "Hello from the RemoteActor"
  }
}
```
<!-- 
 swind.code-life.info/categories/akka.html
-->