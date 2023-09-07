#### 优雅的关闭服务进程

1. 处理进程kill信号
2. 停止接收客户端请求
3. 关闭所有数据处理进程
4. 退出进程

````
node server-01.js
Example app listening on port 3000!
MongoDB connected.
SIGTERM signal received.
Closing http server.
Http server closed.
````

````
Example app listening on port 3000!
MongoDB connected.
SIGTERM signal received.
Closing http server.
Http server closed.
MongoDB connection closed.
````

````
Api Server running on 3000 port, PID: 18770
MongoDB connected.
SIGTERM signal received.
Closing http server.
event 1 done.
Http server closed.
MongoDB connection closed.
event 2 done.
````

ref: 
https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357
https://blog.risingstack.com/graceful-shutdown-node-js-kubernetes/