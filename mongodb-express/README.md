#### start
````
minikube start --image-mirror-country=cn --kubernetes-version=v1.23.12
````

#### service
````
# must be between 30000~32767
kubectl get service
minikube service [name]
````

#### ingress
````
minikube addons enable ingress
````
