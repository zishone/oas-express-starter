.PHONY: build up run test test-integration 

$(shell cp -n .env.defaults .env)
include .env
export APP_NAME=$(shell node -p "require('./package.json').name")
export APP_VERSION=$(shell node -p "require('./package.json').version")
export APP_PORT=${CONFIG_APP_PORT}

build:
	docker-compose build

up: build
	docker-compose up

run:
	docker-compose -f docker-compose.test.yml run \
		--no-deps \
		-p ${APP_PORT}:${APP_PORT} \
		service \
		npm run watch

test:
	docker-compose -f docker-compose.test.yml run \
		--no-deps \
		service \
		npm run test:coverage

test-integration:
	docker-compose -f docker-compose.test.yml run \
		service \
		npm run test-integration:coverage
