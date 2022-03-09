FROM node:alpine

RUN apk add docker git openrc --no-cache && apk update
RUN addgroup root docker && rc-update add docker boot

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY ./build ./build
COPY ./config ./config
# COPY ./gh-token.txt ./gh-token.txt
COPY ./docker-pass.txt ./docker-pass.txt
COPY ./.env ./.env

ENV PORT=80
ENV MONGO_URL=mongodb://localhost:27017/monitor
ENV HOST=monitor.mogh.tech
ENV LOG=false
ENV CLIENT_PASS=0neieufn833ex9c4iky8q1wcg
ENV HTTP_CLIENT_PASS=ve77xq8LkHiJJixpXC8bs66b
ENV NODE_ENV=production

CMD node build/main.js