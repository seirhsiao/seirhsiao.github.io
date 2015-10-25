---
layout: post
title: 搭建eclipse+maven+scala-ide的scala web开发环境
tags: eclipse maven scala-ide scala
categories: eclipse
---

江湖传闻，scala开发的最佳利器乃 [JetBrains](http://www.jetbrains.com) 的神作 [IntelliJ IDEA](http://www.jetbrains.com/idea)，外加构建工具 [sbt](http://www.scala-sbt.org) 是也。

但因历史原因，项目组成员对 [Eclipse](http://www.eclipse.org/downloads)+[Maven](http://maven.apache.org)组合更为熟悉，为了快速实现项目原型，不增加不确定因素带来的风险，搭建一套 [Eclipse](http://www.eclipse.org/downloads)+[Maven](http://maven.apache.org)+[Scala-IDE](http://scala-ide.org) 的开发环境。

基本原则是，必须完全满足但不限于以下几点内容：

*   方便重构，方便调试，支持热部署。
*   可直接使用已有maven的本地和私服仓库。
*   可以无束缚的只用自己熟悉的语言编写代码。
*   可以快速混合编译scala+java代码，包括交叉引用的文件。

如果你有洁癖，可以自己下载[Eclipse](http://www.eclipse.org/downloads)，然后安装各种插件。但是可能会遇到插件依赖包版本冲突之类的问题，为了速度，我直接下载官方打包好的 [Scala-IDE](http://scala-ide.org/download/sdk.html)，有各种平台可供选择。

使用 [Git](http://git-scm.com) 管理项目源代码，需要安装 [EGit](http://www.eclipse.org/egit) 插件，Eclipse插件更新地址 [EGit Updates](http://download.eclipse.org/egit/updates)。

假设项目名称为 **feeling**，使用 JDK 1.7，Servlet 3.0，最终目录结构如下。
```
.
├── .settings                    #eclipse工程目录
├── .classpath                   #eclipse classpath文件
├── .project                     #eclipse project文件
├── src                          #源代码
|   ├── main                     #源代码主目录
|   |   ├── java                 #java代码
|   |   ├── scala                #scala代码
|   |   ├── resources            #资源文件
|   |   └── webapp               #web主目录
|   |       ├── WEB-INF          #WEB-INF目录
|   |       |   └── web.xml      #web.xml文件
|   |       └── index.jsp        #主页面
|   └── test                     #测试代码
|       ├── java                 #java测试代码
|       ├── scala                #scala测试代码
|       └── resources            #测试资源文件
├── .gitignore                   #git忽略配置
├── target                       #编译输出目录
├── README.md                    #markdown格式的说明文件
└── pom.xml                      #maven的pom文件
```

<a id="more"></a>

pom.xml文件
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v400.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>feeling</groupId>
  <artifactId>feeling</artifactId>
  <version>0.0.1</version>
  <packaging>war</packaging>

  <!-- <name>${project.artifactId}</name> -->
  <name>feeling</name>
  <description>our wonderfully feeling application</description>
  <url>http://feeling.com</url>
  <inceptionYear>2014</inceptionYear>

  <organization>
    <name>feeling</name>
    <url>http://feeling.com</url>
  </organization>

  <licenses>
    <license>
      <name>The Apache Software License, Version 2.0</name>
      <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
      <distribution>repo</distribution>
    </license>
  </licenses>

  <developers>
    <developer>
      <id>bruce</id>
      <name>bruce sha</name>
      <url>http://bruce-sha.github.io</url>
      <email>bu.ru@qq.com</email>
    </developer>
  </developers>

  <scm>
  	<connection>http://17.20.13.23/scm/git/feeling</connection>
  	<developerConnection>http://17.20.13.23/scm/git/feeling</developerConnection>
  	<url>http://17.20.13.23</url>
  </scm>

  <properties>
    <scala.version>2.10.3</scala.version>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
    <encoding>UTF-8</encoding>
  </properties>

  <!-- 个性化开发 -->
  <profiles>
    <profile>
      <id>dev</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <properties>
        <build.param>this is dev</build.param>
      </properties>
    </profile>
    <profile>
      <id>release</id>
      <activation>
        <activeByDefault>false</activeByDefault>
      </activation>
      <properties>
        <build.param>this is relase</build.param>
      </properties>
    </profile>
  </profiles>

  <dependencies>

    <!-- google -->
    <dependency>
      <groupId>com.google.guava</groupId>
      <artifactId>guava</artifactId>
      <version>15.0</version>
    </dependency>
    <dependency>
      <groupId>com.google.inject</groupId>
      <artifactId>guice</artifactId>
      <version>3.0</version>
    </dependency>

    <!-- servlet -->
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <!-- <version>2.5</version> -->
      <version>3.0.1</version>
      <scope>provided</scope>
    </dependency>

    <!-- <dependency> -->
    <!-- <groupId>javax.servlet</groupId> -->
    <!-- <artifactId>jsp-api</artifactId> -->
    <!-- <version>2.0</version> -->
    <!-- <scope>provided</scope> -->
    <!-- </dependency> -->

    <!-- scala -->
    <dependency>
      <groupId>org.scala-lang</groupId>
      <artifactId>scala-library</artifactId>
      <version>${scala.version}</version>
    </dependency>

    <!-- test -->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>

    <!-- 其他包不再一一描述 -->    
    <!-- log -->
    <!-- json -->
    <!-- mongodb -->
    <!-- quartz -->

  </dependencies>

  <build>
    <finalName>feeling</finalName>

    <!-- 必须要，资源文件中占位符被profile替换的关键配置 -->
    <resources>
      <resource>
        <directory>src/main/resources</directory>
        <includes>
          <include>.</include>
        </includes>
        <filtering>true</filtering>
      </resource>
    </resources>

    <!-- 必须干掉，否则不编译src/main/java下的代码 -->
    <!-- <sourceDirectory>src/main/scala</sourceDirectory> -->
    <!-- <testSourceDirectory>src/test/scala</testSourceDirectory> -->
    <plugins>
      <plugin>
        <!-- see http://davidb.github.com/scala-maven-plugin -->
        <groupId>net.alchim31.maven</groupId>
        <artifactId>scala-maven-plugin</artifactId>
        <version>3.1.6</version>
        <!-- 必须要，否则不能混合编译交叉引用文件 -->
        <executions>
          <execution>
            <id>scala-compile-first</id>
            <phase>process-resources</phase>
            <goals>
              <goal>add-source</goal>
              <goal>compile</goal>
            </goals>
          </execution>
          <execution>
            <id>scala-test-compile</id>
            <phase>process-test-resources</phase>
            <goals>
              <goal>testCompile</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>2.13</version>
        <configuration>
          <useFile>false</useFile>
          <disableXmlReport>true</disableXmlReport>
          <!-- If you have classpath issue like NoDefClassError,... -->
          <!-- useManifestOnlyJar>false</useManifestOnlyJar -->
          <includes>
            <include>/Test.</include>
            <include>**/Suite.</include>
          </includes>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-war-plugin</artifactId>
        <version>2.4</version>
        <configuration>
          <!-- 移除web.xml的依赖，Servlet 3.0可以不要web.xml文件 -->
          <failOnMissingWebXml>false</failOnMissingWebXml>
        </configuration>
      </plugin>

      <!-- jetty6，不支持servlet3 -->
      <!-- <plugin> -->
      <!-- <groupId>org.mortbay.jetty</groupId> -->
      <!-- <artifactId>maven-jetty-plugin</artifactId> -->
      <!-- <version>6.1.26</version> -->
      <!-- <configuration> -->
      <!-- <scanIntervalSeconds>10</scanIntervalSeconds> -->
      <!-- <stopKey>foo</stopKey> -->
      <!-- <stopPort>9999</stopPort> -->
      <!-- </configuration> -->
      <!-- <executions> -->
      <!-- <execution> -->
      <!-- <id>start-jetty</id> -->
      <!-- <phase>pre-integration-test</phase> -->
      <!-- <goals> -->
      <!-- <goal>run</goal> -->
      <!-- </goals> -->
      <!-- <configuration> -->
      <!-- <scanIntervalSeconds>0</scanIntervalSeconds> -->
      <!-- <daemon>true</daemon> -->
      <!-- </configuration> -->
      <!-- </execution> -->
      <!-- <execution> -->
      <!-- <id>stop-jetty</id> -->
      <!-- <phase>post-integration-test</phase> -->
      <!-- <goals> -->
      <!-- <goal>stop</goal> -->
      <!-- </goals> -->
      <!-- </execution> -->
      <!-- </executions> -->
      <!-- </plugin> -->

      <!-- tomcat7:run 注意tomcat:run跑的是6，不支持servlet3 -->
      <plugin>
        <!-- http://tomcat.apache.org/maven-plugin-2.0/tomcat7-maven-plugin -->
        <groupId>org.apache.tomcat.maven</groupId>
        <artifactId>tomcat7-maven-plugin</artifactId>
        <version>2.2</version>
        <configuration>
          <path>/</path>
          <port>80</port>
        </configuration>
      </plugin>

      <!-- jetty:run -->
      <plugin>
        <!-- http://wiki.eclipse.org/Jetty/Feature/JettyMavenPlugin -->
        <groupId>org.mortbay.jetty</groupId>
        <!-- <artifactId>maven-jetty-plugin</artifactId> 这是jetty6 不支持servlet3 -->
        <artifactId>jetty-maven-plugin</artifactId>
        <version>8.1.13.v20130916</version>
        <configuration>
          <stopPort>9966</stopPort>
          <stopKey>foo</stopKey>
          <scanIntervalSeconds>0</scanIntervalSeconds>
          <connectors>
            <connector implementation="org.eclipse.jetty.server.nio.SelectChannelConnector">
              <port>80</port>
              <maxIdleTime>60000</maxIdleTime>
            </connector>
          </connectors>
          <webAppConfig>
            <contextPath>/</contextPath>
          </webAppConfig>
        </configuration>
      </plugin>

    </plugins>
  </build>
</project>
```

web.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- <web-app -->
<!-- xmlns="http://java.sun.com/xml/ns/javaee" -->
<!-- xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" -->
<!-- xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app25.xsd" -->
<!-- version="2.5" -->
<!-- > -->
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns="http://java.sun.com/xml/ns/javaee"
  xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_30.xsd"
  id="WebAppID" version="3.0">

  <display-name>feeling</display-name>

  <!--   <servlet> -->
  <!--   <servlet-name>feeling</servlet-name> -->
  <!--   <servlet-class>feelings.service.FeelingService</servlet-class> -->
  <!--   </servlet> -->

  <!--   <servlet-mapping> -->
  <!--   <servlet-name>feeling</servlet-name> -->
  <!--   <url-pattern>/feeling</url-pattern> -->
  <!--   </servlet-mapping> -->
  
  <welcome-file-list>
    <welcome-file>index.html</welcome-file>
    <welcome-file>index.htm</welcome-file>
    <welcome-file>index.jsp</welcome-file>
    <welcome-file>default.html</welcome-file>
    <welcome-file>default.htm</welcome-file>
    <welcome-file>default.jsp</welcome-file>
  </welcome-file-list>
  
</web-app>
```


.project文件：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
  <name>feeling</name>
  <comment></comment>
  <projects>
  </projects>
  <buildSpec>
    <buildCommand>
      <name>org.scala-ide.sdt.core.scalabuilder</name>
      <arguments>
      </arguments>
    </buildCommand>
    <buildCommand>
      <name>org.eclipse.m2e.core.maven2Builder</name>
      <arguments>
      </arguments>
    </buildCommand>
  </buildSpec>
  <natures>
    <nature>org.scala-ide.sdt.core.scalanature</nature>
    <nature>org.eclipse.jdt.core.javanature</nature>
    <nature>org.eclipse.m2e.core.maven2Nature</nature>
  </natures>
</projectDescription>
```

.classpath文件：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
  <name>feeling</name>
  <comment></comment>
  <projects>
  </projects>
  <buildSpec>
    <buildCommand>
      <name>org.scala-ide.sdt.core.scalabuilder</name>
      <arguments>
      </arguments>
    </buildCommand>
    <buildCommand>
      <name>org.eclipse.m2e.core.maven2Builder</name>
      <arguments>
      </arguments>
    </buildCommand>
  </buildSpec>
  <natures>
    <nature>org.scala-ide.sdt.core.scalanature</nature>
    <nature>org.eclipse.jdt.core.javanature</nature>
    <nature>org.eclipse.m2e.core.maven2Nature</nature>
  </natures>
</projectDescription><?xml version="1.0" encoding="UTF-8"?>
<classpath>
  <classpathentry kind="src" output="target/classes" path="src/main/java">
    <attributes>
      <attribute name="optional" value="true"/>
      <attribute name="maven.pomderived" value="true"/>
    </attributes>
  </classpathentry>
  <classpathentry kind="src" output="target/classes" path="src/main/scala">
    <attributes>
      <attribute name="optional" value="true"/>
      <attribute name="maven.pomderived" value="true"/>
    </attributes>
  </classpathentry>
  <classpathentry including="/.java" kind="src" path="src/main/resources"/>
  <classpathentry kind="src" output="target/test-classes" path="src/test/java">
    <attributes>
      <attribute name="optional" value="true"/>
      <attribute name="maven.pomderived" value="true"/>
    </attributes>
  </classpathentry>
  <classpathentry kind="src" output="target/test-classes" path="src/test/scala">
    <attributes>
      <attribute name="optional" value="true"/>
      <attribute name="maven.pomderived" value="true"/>
    </attributes>
  </classpathentry>
  <classpathentry including="/.java" kind="src" path="src/test/resources"/>
  <classpathentry kind="con" path="org.scala-ide.sdt.launching.SCALACONTAINER"/>
  <classpathentry kind="con" path="org.eclipse.jdt.launching.JRECONTAINER/org.eclipse.jdt.internal.debug.ui.launcher.StandardVMType/JavaSE-1.7">
    <attributes>
      <attribute name="maven.pomderived" value="true"/>
    </attributes>
  </classpathentry>
  <classpathentry kind="con" path="org.eclipse.m2e.MAVEN2CLASSPATHCONTAINER">
    <attributes>
      <attribute name="maven.pomderived" value="true"/>
    </attributes>
  </classpathentry>
  <classpathentry kind="output" path="target/classes"/>
</classpath>
```
