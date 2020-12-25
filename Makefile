.PHONY: build up run test test-integration 

$(shell cp -n .env.defaults .env)
include .env
export APP_NAME=$(shell node -p "require('./package.json').name")
export APP_VERSION=$(shell node -p "require('./package.json').version")
export APP_PORT=${CONFIG_APP_PORT}

build:
	docker-compose build \
		service

up: build
	docker-compose up \
		service

run: build
	docker-compose run \
		--no-deps \
		service \
		npm run start

test:
	docker-compose -f docker-compose.test.yml run \
		--no-deps \
		service \
		npm run test:coverage

test-integration:
	docker-compose -f docker-compose.test.yml run \
		service \
		npm run test-integration:coverage
