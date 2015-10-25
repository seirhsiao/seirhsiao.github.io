---
layout: post
title: 如何停止一个正在运行的java线程
tags: concurrency java
categories: java
---

![stop](http://bruce.u.qiniudn.com/2013/12/19/stop.jpg)

与此问题相关的内容主要涉及三部分：已废弃的Thread.stop()、迷惑的thread.interrupt系列、最佳实践Shared Variable。

<a id="more"></a>

## 已废弃的Thread.stop()

* * *

```java
@Deprecated
public final void stop() {
    stop(new ThreadDeath());
}
```

如上是Hotspot JDK 7中的java.lang.Thread.stop()的代码，学习一下它的doc：

> 该方法天生是不安全的。使用_thread.stop()_停止一个线程，导致释放（解锁）所有该线程已经锁定的监视器（因沿堆栈向上传播的未检查异常_ThreadDeath_而解锁）。如果之前受这些监视器保护的任何对象处于不一致状态，则不一致状态的对象（受损对象）将对其他线程可见，这可能导致任意的行为。

是不是差点被这段话绕晕，俗点说：目标线程可能持有一个监视器，假设这个监视器控制着某两个值之间的逻辑关系，如var1必须小于var2，某一时刻var1等于var2，本来应该受保护的逻辑关系，不幸的是此时恰好收到一个stop命令，产生一个ThreadDeath错误，监视器被解锁。这就导致逻辑错误，当然这种情况也可能不会发生，是不可预料的。注意：ThreadDeath是何方神圣？是个java.lang.Error，不是java.lang.Exception。

```java
public class ThreadDeath extends Error {
    private static final long serialVersionUID = -4417128565033088268L;
}
```

> _thread.stop()_方法的许多应用应该由“只修改某些变量以指示目标线程应该停止”的代码取代。目标线程应周期性的检查该变量，当发现该变量指示其要停止运行，则退出_run_方法。如果目标线程等待很长时间，则应该使用_interrupt_方法中断该等待。

其实这里已经暗示停止一个线程的最佳方法：**条件变量** 或 **条件变量+中断**。

> 更多请查看：
> [Why are Thread.stop, Thread.suspend and Thread.resume Deprecated?](http://docs.oracle.com/javase/7/docs/technotes/guides/concurrency/threadPrimitiveDeprecation.html)

上文请参考我的翻译xxx。

其它关于stop方法的doc：

> 1.  该方法强迫停止一个线程，并抛出一个新创建的ThreadDeath对象作为异常。
> 2.  停止一个尚未启动的线程是允许的，如果稍后启动该线程，它会立即终止。
> 3.  通常不应试图捕获ThreadDeath，除非它必须执行某些异常的清除操作。如果catch子句捕获了一个ThreadDeath对象，则必须重新抛出该对象，这样该线程才会真正终止。

**小结：**
Thread.stop()不安全，已不再建议使用。

## 令人迷惑的thread.interrupt()

* * *

Thread类中有三个方法会令新手迷惑，他们是：

```java
public void Thread.interrupt() // 无返回值
public boolean Thread.isInterrupted() // 有返回值
public static boolean Thread.interrupted() // 静态，有返回值
```

如果按照近几年流行的[重构](http://book.douban.com/subject/4262627)，[代码整洁之道](http://book.douban.com/subject/4199741)，[程序员修炼之道](http://book.douban.com/subject/1152111)等书的观点，这几个方法的命名相对于其实现的功能来说，不够直观明确，极易令人混淆，是低级程序猿的代码。逐个分析：

```java
public void interrupt() {
    if (this != Thread.currentThread())
        checkAccess();
    synchronized (blockerLock) {
        Interruptible b = blocker;
        if (b != null) {
            interrupt0();        // Just to set the interrupt flag
            b.interrupt(this);
            return;
        }
    }
    interrupt0();
}
```

中断本线程。无返回值。具体作用分以下几种情况：

*   如果该线程正阻塞于_Object_类的_wait()_、_wait(long)_、_wait(long, int)_方法，或者_Thread_类的_join()_、_join(long)_、_join(long, int)_、_sleep(long)_、_sleep(long, int)_方法，则该线程的**中断状态将被清除，并收到一个_java.lang.InterruptedException_**。
*   如果该线程正阻塞于_interruptible channel_上的I/O操作，则该通道将被关闭，同时该线程的**中断状态被设置，并收到一个_java.nio.channels.ClosedByInterruptException_**。
*   如果该线程正阻塞于一个_java.nio.channels.Selector_操作，则该线程的**中断状态被设置**，它将立即从选择操作返回，并可能带有一个非零值，就好像调用_java.nio.channels.Selector.wakeup()_方法一样。
*   如果上述条件都不成立，则该线程的**中断状态将被设置**。
> **小结**：第一种情况最为特殊，阻塞于wait/join/sleep的线程，中断状态会被清除掉，同时收到著名的InterruptedException；而其他情况中断状态都被设置，并不一定收到异常。

中断一个不处于活动状态的线程不会有任何作用。如果是其他线程在中断该线程，则java.lang.Thread.checkAccess()方法就会被调用，这可能抛出java.lang.SecurityException。

```java
public void interrupt() {
    if (this != Thread.currentThread())
        checkAccess();
    synchronized (blockerLock) {
        Interruptible b = blocker;
        if (b != null) {
            interrupt0();        // Just to set the interrupt flag
            b.interrupt(this);
            return;
        }
    }
    interrupt0();
}
```

检测当前线程是否已经中断，是则返回true，否则false，**并清除中断状态**。换言之，如果该方法被连续调用两次，第二次必将返回false，除非在第一次与第二次的瞬间线程再次被中断。如果中断调用时线程已经不处于活动状态，则返回false。

```java
public boolean isInterrupted() {
    return isInterrupted(false);
}
```

检测当前线程是否已经中断，是则返回true，否则false。中断状态不受该方法的影响。如果中断调用时线程已经不处于活动状态，则返回false。

> interrupted()与isInterrupted()的唯一区别是，**前者会读取并清除中断状态，后者仅读取状态。**

在hotspot源码中，两者均通过调用的native方法isInterrupted(boolean)来实现，区别是参数值ClearInterrupted不同。

```java
private native boolean isInterrupted(boolean ClearInterrupted);
```

经过上面的分析，三者之间的区别已经很明确，来看一个具体案例，是我在工作中看到某位架构师的代码，只给出最简单的概要结构：

```java
public void run() {
  while(!Thread.currentThread().isInterrupted()) {
      try {
           Thread.sleep(10000L);
           ... //为篇幅，省略其它io操作
           ... //为简单，省略其它interrupt操作
      } catch (InterruptedException e) { break; }
  }
}
```

我最初被这段代码直接绕晕，用thread.isInterrupted()方法作为循环中止条件可以吗？

根据上文的分析，当该方法阻塞于wait/join/sleep时，中断状态会被清除掉，同时收到InterruptedException，也就是接收到的值为false。上述代码中，当sleep之后的调用otherDomain.xxx()，otherDomain中的代码包含wait/join/sleep并且InterruptedException被catch掉的时候，线程无法正确的中断。

因此，在编写多线程代码的时候，**任何时候捕获到InterruptedException，要么继续上抛，要么重置中断状态，这是最安全的做法**，参考[『Java Concurrency in Practice』](http://book.douban.com/subject/1888733)。凡事没有绝对，如果你可以确保一定没有这种情况发生，这个代码也是可以的。

> 下段内容引自：**[『Java并发编程实战』](http://book.douban.com/subject/10484692) 第5章 基础构建模块 5.4 阻塞方法与中断方法  p77**

当某个方法抛出InterruptedException时，表示该方法是一个阻塞方法。当在代码中调用一个将抛出InterruptedException异常的方法时，你自己的方法也就变成了一个阻塞方法，并且必须要处理对中断的相应。对于库代码来说，有两种选择：

*   传递InterruptedException。这是最明智的策略，将异常传递给方法的调用者。
*   恢复中断。在不能上抛的情况下，如Runnable方法，必须捕获InterruptedException，并通过当前线程的interrupt()方法恢复中断状态，这样在调用栈中更高层的代码将看到引发了一个中断。如下代码是模板：

```java
public void run() {
    try {
          // ① 调用阻塞方法
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();    // ② 恢复被中断的状态
        }
}
```

最后再强调一遍，②处的 Thread.currentThread().interrupt() 非常非常重要。

## 最佳实践：Shared Variable

* * *

不记得哪本书上曾曰过，最佳实践是个烂词。在这里这个词最能表达意思，停止一个线程最好的做法就是利用共享的条件变量。

对于本问题，我认为准确的说法是：**停止一个线程的最佳方法是让它执行完毕，没有办法立即停止一个线程，但你可以控制何时或什么条件下让他执行完毕。**

通过条件变量控制线程的执行，线程内部检查变量状态，外部改变变量值可控制停止执行。为保证线程间的即时通信，需要使用使用volatile关键字或锁，确保读线程与写线程间变量状态一致。下面给一个最佳模板：

```java
/**
 * @author bruce_sha (bruce-sha.github.io)
 * @version 2013-12-23
 */
public class BestPractice extends Thread {
    private volatile boolean finished = false;   // ① volatile条件变量
    public void stopMe() {
        finished = true;    // ② 发出停止信号
    }
    @Override
    public void run() {
        while (!finished) {    // ③ 检测条件变量
            // do dirty work   // ④业务代码
        }
    }
}
```

* * *

本文尚未完成，请耐心等待。

* * *

当④处的代码阻塞于wait()或sleep()时，线程不能立刻检测到条件变量。因此②处的代码最好同时调用interrupt()方法。

小结：
[How to Stop a Thread or a Task ?](http://forward.com.au/javaProgramming/HowToStopAThread.html) 详细讨论了如何停止一个线程, 总结起来有三点：

1.  使用violate boolean变量来标识线程是否停止。
2.  停止线程时，需要调用停止线程的interrupt()方法，因为线程有可能在wait()或sleep(), 提高停止线程的即时性。
3.  对于blocking IO的处理，尽量使用InterruptibleChannel来代替blocking IO。

## 总结：

* * *

> 要使任务和线程能安全、快速、可靠地停止下来，并不是一件容易的事。Java没有提供任何机制来安全地终止线程。但它提供了中断（Interruption），这是一种协作机制，能够使一个线程终止另一个线程的的工作。—— [『Java并发编程实战』](http://book.douban.com/subject/10484692) 第7章 取消与关闭 p111
> 
> 中断是一种协作机制。一个线程不能强制其它线程停止正在执行的操作而去执行其它的操作。当线程A中断B时，A仅仅是要求B在执行到某个可以暂停的地方停止正在执行的操作——前提是如果线程B愿意停下来。—— [『Java并发编程实战』](http://book.douban.com/subject/10484692) 第5章 基础构建模块 p77

总之，中断只是一种协作机制，需要被中断的线程自己处理中断。停止一个线程最佳实践是 **中断 + 条件变量**。

## 参考文献

* * *

1.  [Why are Thread.stop, Thread.suspend and Thread.resume Deprecated ?](http://docs.oracle.com/javase/7/docs/technotes/guides/concurrency/threadPrimitiveDeprecation.html)
2.  [详细分析Java中断机制](http://www.infoq.com/cn/articles/java-interrupt-mechanism)
3.  [How to stop a java thread gracefully ?](http://stackoverflow.com/questions/3194545/how-to-stop-a-java-thread-gracefully)
4.  **[How to Stop a Thread or a Task ?](http://forward.com.au/javaProgramming/HowToStopAThread.html)**
5.  [为什么不能使用Thread.stop()方法？](http://yeziwang.iteye.com/blog/844649)
6.  [为什么 Thread.stop和Thread.suspend等被废弃了？](http://blog.csdn.net/dlite/article/details/4212915)