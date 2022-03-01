FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY ./src .

EXPOSE 3333

CMD ["node", "app.js"]