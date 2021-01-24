FROM node:10.23.1-alpine3.11

WORKDIR /usr/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci --no-update-notifier

COPY ./src ./src/
COPY ./tsconfig.json ./

RUN npm run build

COPY ./.env.defaults ./
COPY ./db/ ./db/

CMD npm run start 
