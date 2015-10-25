---
layout: post
title: mongoDB 3.0 安全权限访问控制
tags: mongodb
categories: db
---

MongoDB3.0权限，啥都不说了，谷歌百度出来的全是错的。先安装好盲沟，简单的没法说。

首先，不使用 _—auth_ 参数，启动 mongoDB：

```bash
mongodb-linux-i686-3.0.0/bin/mongod -f mongodb-linux-i686-3.0.0/mongodb.conf
```
> 此时你 _show dbs_ 会看到只有一个local数据库，那个所谓的admin是不存在的。

mongoDB 没有炒鸡无敌用户root，只有能管理用户的用户 [userAdminAnyDatabase](http://docs.mongodb.org/manual/reference/built-in-roles/#userAdminAnyDatabase)。

打开 **mongo shell**：

```bash
mongodb-linux-i686-3.0.0/bin/mongo
```

添加管理用户：

```
use admin
db.createUser(
  {
    user: "buru",
    pwd: "12345678",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```
<a id="more"></a>
> roles 中的 db 参数是必须的，不然会报错：_Error: couldn’t add user: Missing expected field “db”_。另外，有很多文章记录的是使用 [db.addUser(…)](http://docs.mongodb.org/v2.2/reference/method/db.addUser) 方法，这个方法是旧版的，3.0中已经不存在，详见：[http://docs.mongodb.org/manual/reference/method/js-user-management](http://docs.mongodb.org/manual/reference/method/js-user-management)。

切换到admin下，查看刚才创建的用户：

```
show users
或
db.system.users.find()
```
```
{ "_id" : "admin.buru", "user" : "buru", "db" : "admin", "credentials" : { "SCRAM-SHA-1" : { "iterationCount" : 10000, "salt" : "gwVwuA/dXvxgSHavEnlyvA==", "storedKey" : "l2QEVTEujpkCuqDEKqfIWbSv4ms=", "serverKey" : "M1ofNKXg2sNCsFrBJbX4pXbSgvg=" } }, "roles" : [ { "role" : "userAdminAnyDatabase", "db" : "admin" } ] }
```
> 怎么关闭 mongoDB？千万不要 kill -9 pid，可以 kill -2 pid 或 db.shutdownServer()

下面使用 _—auth_ 参 数，重新启动 mongoDB：

```bash
mongodb-linux-i686-3.0.0/bin/mongod --auth -f mongodb-linux-i686-3.0.0/mongodb.conf
```

再次打开 **mongo shell**：

```bash
mongodb-linux-i686-3.0.0/bin/mongo
use admin
db.auth("buru","12345678") #认证，返回1表示成功
或
mongodb-linux-i686-3.0.0/bin/mongo -u buru -p 12345678 --authenticationDatabase admin
```

此时

```bash
show collections
```

报错
```
2015-03-17T10:15:56.011+0800 E QUERY    Error: listCollections failed: {
  "ok" : 0,
  "errmsg" : "not authorized on admin to execute command { listCollections: 1.0 }",
  "code" : 13
}
  at Error (<anonymous>)
  at DB._getCollectionInfosCommand (src/mongo/shell/db.js:643:15)
  at DB.getCollectionInfos (src/mongo/shell/db.js:655:20)
  at DB.getCollectionNames (src/mongo/shell/db.js:666:17)
  at shellHelper.show (src/mongo/shell/utils.js:625:12)
  at shellHelper (src/mongo/shell/utils.js:524:36)
  at (shellhelp2):1:1 at src/mongo/shell/db.js:643
```

因为，用户buru只有用户管理的权限。

下面创建用户，用户都跟着库走，创建的用户都是

```
use tianhe
db.createUser(
 {
   user: "bao",
   pwd: "12345678",
   roles: [
      { role: "readWrite", db: "tianhe" },
      { role: "read", db: "tianhe2" }
   ]
 }
)
```

查看刚刚创建的用户。

```
show users

{
  "_id" : "tianhe.bao",
  "user" : "bao",
  "db" : "tianhe",
  "roles" : [
    {
      "role" : "readWrite",
      "db" : "tianhe"
    },
    {
      "role" : "read",
      "db" : "tianhe2"
    }
  ]
}
```

查看整个mongoDB全部的用户：

```
use admin
db.system.users.find()

{ "id" : "admin.buru", "user" : "buru", "db" : "admin", "credentials" : { "SCRAM-SHA-1" : { "iterationCount" : 10000, "salt" : "gwVwuA/dXvxgSHavEnlyvA==", "storedKey" : "l2QEVTEujpkCuqDEKqfIWbSv4ms=", "serverKey" : "M1ofNKXg2sNCsFrBJbX4pXbSgvg=" } }, "roles" : [ { "role" : "userAdminAnyDatabase", "db" : "admin" } ] }
{ "id" : "tianhe.bao", "user" : "bao", "db" : "tianhe", "credentials" : { "SCRAM-SHA-1" : { "iterationCount" : 10000, "salt" : "//xy1V1fbqEHC1gzQqZHGQ==", "storedKey" : "ZS/o54zzl/FdcXLQJ98KdAVTfF0=", "serverKey" : "iIpNYz2Gk8KhyK3zgz6muBt0PI4=" } }, "roles" : [ { "role" : "readWrite", "db" : "tianhe" }, { "role" : "read", "db" : "tianhe2" } ] }
```

创建完毕，验证一下：

```
use buru
show collections

2015-03-17T10:30:06.461+0800 E QUERY    Error: listCollections failed: {
  "ok" : 0,
  "errmsg" : "not authorized on buru to execute command { listCollections: 1.0 }",
  "code" : 13
}
  at Error (<anonymous>)
  at DB._getCollectionInfosCommand (src/mongo/shell/db.js:643:15)
  at DB.getCollectionInfos (src/mongo/shell/db.js:655:20)
  at DB.getCollectionNames (src/mongo/shell/db.js:666:17)
  at shellHelper.show (src/mongo/shell/utils.js:625:12)
  at shellHelper (src/mongo/shell/utils.js:524:36)
  at (shellhelp2):1:1 at src/mongo/shell/db.js:643
```

显然没权限，先auth：

```
db.auth("bao","12345678")
1
show collections
news
system.indexes
wahaha
```

完毕！

**参考：**
Mongo Shell：[http://docs.mongodb.org/v2.2/tutorial/getting-started-with-the-mongo-shell](http://docs.mongodb.org/v2.2/tutorial/getting-started-with-the-mongo-shell)
Enable Access Control：[http://docs.mongodb.org/manual/tutorial/enable-authentication](http://docs.mongodb.org/manual/tutorial/enable-authentication)
Add a User to a Database：[http://docs.mongodb.org/manual/tutorial/add-user-to-database](http://docs.mongodb.org/manual/tutorial/add-user-to-database)
User Methods：[http://docs.mongodb.org/manual/reference/method/js-user-management](http://docs.mongodb.org/manual/reference/method/js-user-management)
Role Methods：[http://docs.mongodb.org/manual/reference/method/js-role-management](http://docs.mongodb.org/manual/reference/method/js-role-management)