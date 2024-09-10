FROM node:20-alpine3.18

WORKDIR /usr/src/app

RUN apk update && apk add --no-cache \
    python3 \
    py3-pip \
    build-base \
    tzdata \
    && npm cache clean --force

ENV TZ=Asia/Dubai

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
