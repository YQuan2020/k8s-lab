#!/bin/sh

kubectl create secret tls express.beyond2025.cloud \
    --namespace default \
    --key ./ssl/privkey.pem \
    --cert ./ssl/fullchain.pem