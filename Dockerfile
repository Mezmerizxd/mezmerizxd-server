FROM node:16.16.0

WORKDIR /usr/src/app

RUN npm install -g yarn

RUN yarn global add nodemon

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000 5550

#Build to project
RUN yarn build

# Run node server
CMD yarn start