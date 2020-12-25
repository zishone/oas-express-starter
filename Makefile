.PHONY: ensure-dotenv build up test run test-integration 

define readPackageJson
	$(shell node -p "require('./package.json').$(1)")
endef

CONFIG_APP_NAME		:= $(firstword $(subst :, ,$(call readPackageJson,name)))
CONFIG_APP_VERSION	:= $(firstword $(subst :, ,$(call readPackageJson,version)))

ensure-dotenv:
ifeq (,$(wildcard ./.env))
	cp .env.defaults .env
endif
include .env
export $(shell sed 's/=.*//' .env)

build: ensure-dotenv
	APP_NAME=${CONFIG_APP_NAME} \
	APP_VERSION=${CONFIG_APP_VERSION} \
	APP_PORT=${CONFIG_APP_PORT} \
	docker-compose build \
		${SERVICE}

up: ensure-dotenv
	APP_NAME=${CONFIG_APP_NAME} \
	APP_VERSION=${CONFIG_APP_VERSION} \
	APP_PORT=${CONFIG_APP_PORT} \
	docker-compose up \
		${SERVICE}

test: build
	APP_NAME=${CONFIG_APP_NAME} \
	APP_VERSION=${CONFIG_APP_VERSION} \
	APP_PORT=${CONFIG_APP_PORT} \
	docker-compose run \
		-v [.data=/app/.data] \
		--no-deps \
		oas-service \
		npm run test:coverage

run: build
	APP_NAME=${CONFIG_APP_NAME} \
	APP_VERSION=${CONFIG_APP_VERSION} \
	APP_PORT=${CONFIG_APP_PORT} \
	docker-compose run \
		-v [.data=/app/.data] \
		--no-deps \
		oas-service \
		npm run start

test-integration: build
	APP_NAME=${CONFIG_APP_NAME} \
	APP_VERSION=${CONFIG_APP_VERSION} \
	APP_PORT=${CONFIG_APP_PORT} \
	docker-compose run \
		-v [.data=/app/.data] \
		oas-service \
		npm run test-integration:coverage
