FROM node:16

WORKDIR /app

COPY ./package*.json ./

RUN yarn install

COPY . .

EXPOSE 8080

CMD ["yarn", "run", "start-production"]