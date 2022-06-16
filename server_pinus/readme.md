

# docker安装mysql
* m1的mac电脑docker安装mysql:[Mac m1 docker 安装mysql](https://www.jianshu.com/p/eb3d9129d880)
* docker 挂载
```
    docker run -d  --name mysql-docker \
    -v /Users/even/workspace/docker-v/mysql/data:/var/lib/mysql \
    -v /Users/even/workspace/docker-v/mysql/conf:/etc/mysql \
    -v /Users/even/workspace/docker-v/mysql/log:/var/log/mysql \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=123456 \
    mysql/mysql-server \
    --character-set-server=utf8mb4 \
    --collation-server=utf8mb4_general_ci
```

# 流程
* 1、gate服务器：有且只有一个，客户端连接gate服务器完成登录，获取到token,同时gate服务器会指定客户端去连哪一个connector服务器（因为connecotr服务器可能会有多个）
* 2、connector服务器:用于建立了与多个客户端的映射连接。 客户端断开与gate的连接后，通过token连接connector服务器，这样，一个connector服务器就建立了与多个客户端的映射连接。connector仅持有客户端的连接，不作任何逻辑操作。
* 3、lobby服务器：用于排行榜，玩家信息修改，邮件等功能的
* 4、game服务器：用于具体的游戏逻辑业务

# 客户端无法连接gate的原因
* adminServer.ts文件里没有配置gate服务器，会导致客户端无法连接
* Remote方法无法调用的原因
* 检查一下，配置服务器的config文件，是否为该服务器配置了port


# 关于服务器中数据的设计
* 游戏将的数据分为了三层，以user这个对象为例，分别会存在3种类型的数据结构，即传输层user（各种自定义proto或protobuf）,逻辑层user,持久层user
* 1、传输层数据：用于客户端与服务器之间进入交互，例如protocol中的各用user数据结构，这一类型的为数据为传输层数据。本游戏是使用自定义数据结构作为传输层数据，一般其它的游戏项目，多以protobuff来定制协议；比如在login或是register这两个api中，都在response中返回了user相关的数据，但不是全部。这样的情况非常普遍，特别是在使用protobuf时，对于不需要的字断，是不需要在客户端与服务器之间行传输的。传输层的数据应该尽可能的小，以达到极致的性能。
* 2、逻辑层数据：用于服务器内部各模块进入逻辑运算，以user这一结构为例，UserInfo这个类，就是逻辑层数据，主要用于服务器在运行期间的各类运算，相当于将这些数据动态的运行在内存中，高效且迅捷。
* 3、持久层数据：用于存储在数据库中的数据。以user为例，DBUserInfo这个类，就是持久层数据，对于user而言，并不是所有数据都需要存储。
  