FROM node:alpine3.12

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci

COPY ./src ./src/
COPY ./tests ./tests/
COPY ./tsconfig.json ./
COPY ./.env.defaults ./

RUN npm run build

COPY ./db/ ./db/
COPY ./Makefile ./

CMD [ "npm", "run", "start" ]
