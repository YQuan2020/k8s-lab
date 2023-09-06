#! /bin/bash

# method 1:
kubectl create secret docker-registry reg-secret \
    --docker-server=registry.ap-southeast-1.aliyuncs.com \
    --docker-username=ivancyq \
    --docker-password=ivan123456
# method 2:
# base64 -w 0 ~/.docker/config.json
# kubectl create -f registry_secret.yaml
# imagePullSecrets:
# - name: docker_reg_secret