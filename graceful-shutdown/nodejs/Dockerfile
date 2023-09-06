FROM node:20-alpine
LABEL maintainer "ivan@example.com"

ENV DIR=/app
WORKDIR $DIR

COPY package.json $DIR
RUN npm install --omit=dev
COPY . $DIR

ENV NODE_ENV=develop \
    APP_PORT=3000

EXPOSE 3000
CMD node server.js