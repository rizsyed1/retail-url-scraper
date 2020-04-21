FROM node:12.16.1-buster-slim
WORKDIR /usr/src/index
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
