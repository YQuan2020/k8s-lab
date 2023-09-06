#! /bin/bash
cur_sec=`date '+%s'`

docker build -t nodejs-wtf .
docker image tag nodejs-wtf registry.ap-southeast-1.aliyuncs.com/harvest2025/nodejs:$cur_sec
docker image tag nodejs-wtf registry.ap-southeast-1.aliyuncs.com/harvest2025/nodejs:latest
docker push registry.ap-southeast-1.aliyuncs.com/harvest2025/nodejs:$cur_sec
docker push registry.ap-southeast-1.aliyuncs.com/harvest2025/nodejs:latest