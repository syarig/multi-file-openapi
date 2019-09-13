FROM node:latest

WORKDIR /swagger

COPY package*.json ./
COPY . .

RUN npm install

CMD [ "node", "resolve.js", "--watch", "openapi/" ]