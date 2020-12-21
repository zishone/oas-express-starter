FROM node:alpine3.12

RUN apk add --update make

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci

COPY ./src ./src/
COPY ./tsconfig.json ./

RUN npm run build

COPY ./db/ ./db/
COPY ./Makefile ./

CMD [ "make", "run" ]
