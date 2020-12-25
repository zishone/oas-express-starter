FROM node:alpine3.12

WORKDIR /app

RUN mkdir .data

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci --no-update-notifier

COPY ./src ./src/
COPY ./tsconfig.json ./

RUN npm run build

COPY ./.env.defaults ./
COPY ./db/ ./db/
COPY ./tests ./tests/

CMD [ "npm", "run", "start" ]
