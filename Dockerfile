FROM node:alpine3.10

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci

COPY ./src ./src/
COPY ./tsconfig.json ./

RUN npm run build

COPY ./db/ ./db/
COPY ./entrypoint.sh ./

CMD [ "sh", "entrypoint.sh" ]
