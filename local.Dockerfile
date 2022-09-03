FROM node:16.16.0

WORKDIR /usr/src/app

RUN yarn global add nodemon

RUN yarn global add typescript

EXPOSE 3000 5550