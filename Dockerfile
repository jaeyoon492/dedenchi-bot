FROM node:16-alpine

WORKDIR /usr/src/bot

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD ["node", "index.js"]