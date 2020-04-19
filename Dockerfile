FROM node:current-slim

WORKDIR /usr/src/index
COPY package.json .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
COPY . .


