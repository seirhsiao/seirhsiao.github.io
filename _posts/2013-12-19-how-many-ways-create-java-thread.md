---
layout: post
title: java中有几种方法创建一个线程
tags: concurrency java scala
categories: java
---

此乃经典一问，如果非要给出回答的话，我认为最准确的说法是：**有且只有一种方法**。

理由听我慢慢道来。官方权威文档『[The Java Language Specification](http://docs.oracle.com/javase/specs/)』，[JLS7](http://docs.oracle.com/javase/specs/jls/se7/jls7.pdf)，Chapter 17 Threads and Locks （p563），开篇第二段明确指出：

> Threads are represented by the _Thread.class_. **The only way for a user to create a thread is to create an object of this class**; each thread is associated with such an object. A thread will start when the start() method is invoked on the corresponding Thread object.
<a id="more"></a>

因此，创建一个线程的唯一方法是实例化_java.lang.Thread_类(或其子类)，并调用其_start()_方法，这是权威回答。

下面看下其它三本比较流行的书籍是怎么说的。

**第一本：『[Java Performance](http://book.douban.com/subject/5980062/)』**，Chapter 3 JVM Overview，HotSpot VM Runtime，Thread Creation and Destruction (p73) 指出。

> There are two ways for a thread to be introduced in the HotSpot VM; either by exe-cuting Java code that calls the _start()_ method on a _java.lang.Thread_ object, or by attaching an existing native thread to the HotSpot VM using JNI.

文中说，创建一个HotSpot VM（注意其它VM不一定适用）线程有两种方法：

1.  创建一个java.lang.Thread对象，并调用其start()方法
2.  通过本地方法（如JNI）创建本地线程并加入的HotSpot VM中

**第二本：『[Java 7 Concurrency Cookbook](http://book.douban.com/subject/20142617/)』**，Chapter 1 Thread Management，Creating and running a thread 则这么说。

> As with every element in the Java language, threads are objects. We have two ways of creating a thread in Java:
> 
> *   Extending the _Thread_ class and overriding the _run()_ method
> *   Building a class that implements the _Runnable_ interface and then creating an object of the Thread class passing the Runnable object as a parameter

**第三本：『[The Java Tutorials](http://docs.oracle.com/javase/tutorial/)』**，[Essential Java Classes](http://docs.oracle.com/javase/tutorial/essential/index.html)，[Concurrency](http://docs.oracle.com/javase/tutorial/essential/concurrency/index.html)，[Defining and Starting a Thread](http://docs.oracle.com/javase/tutorial/essential/concurrency/runthread.html)中。

> An application that creates an instance of Thread must provide the code that will run in that thread. There are two ways to do this:
> 
> *   Provide a Runnable object. The Runnable interface defines a single method, run, meant to contain the code executed in the thread. The Runnable object is passed to the Thread constructor, as in the HelloRunnable example:


```java
public class HelloRunnable implements Runnable {
    public void run() {
        System.out.println("Hello from a thread!");
    }
    public static void main(String args[]) {
        (new Thread(new HelloRunnable())).start();
    }
}
```

> *   Subclass Thread. The Thread class itself implements Runnable, though its run method does nothing. An application can subclass Thread, providing its own implementation of run, as in the HelloThread example:


```java
public class HelloRunnable implements Runnable {
    public void run() {
        System.out.println("Hello from a thread!");
    }
    public static void main(String args[]) {
        (new Thread(new HelloRunnable())).start();
    }
}
```

 
> Notice that both examples invoke Thread.start in order to start the new thread.

> Which of these idioms should you use? **The first idiom, which employs a Runnable object, is more general, because the Runnable object can subclass a class other than Thread. The second idiom is easier to use in simple applications, but is limited by the fact that your task class must be a descendant of Thread. **

如上两本书的说法应该是大多说人一致认为的正确答案：继承Thread类或实现Runnable接口。同时The Java Tutorials还指出了使用哪种方式创建线程更好。

**总结：**
我认为后两本书的说法只能算是创建线程的两种写法，归根结底都必须create Thread object。我更认可JLS的说法，它是无可争辩的权威。另外还有一些更乱七八糟的说法如executor framework也算一种方法，这样算起来就太多了。在目前的Hotspot JDK 7中，_java.lang.Thread_有8个public构造函数：

```java
public java.lang.Thread.Thread()
public java.lang.Thread.Thread(Runnable)
public java.lang.Thread.Thread(ThreadGroup, Runnable)
public java.lang.Thread.Thread(String)
public java.lang.Thread.Thread(ThreadGroup, String)
public java.lang.Thread.Thread(Runnable, String)
public java.lang.Thread.Thread(ThreadGroup, Runnable, String)
public java.lang.Thread.Thread(ThreadGroup, Runnable, String, long)
```

此外，还有一个非public的构造函数：

```java
java.lang.Thread.Thread(Runnable, AccessControlContext)
```
<!--
bruce.u.qiniudn.com/2013/12/17/thread.jpg
-->