.PHONY: ensure-dotenv build test run test-integration up

define readPackageJson
	$(shell node -p "require('./package.json').$(1)")
endef

APP_NAME		:= $(firstword $(subst :, ,$(call readPackageJson,name)))
APP_VERSION	:= $(firstword $(subst :, ,$(call readPackageJson,version)))

ensure-dotenv:
ifeq (,$(wildcard ./.env))
	cp .env.defaults .env
endif

build: ensure-dotenv
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose build \
		${SERVICE}

test: ensure-dotenv
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose run \
		--no-deps \
		oas-service \
		npm run test

run: ensure-dotenv
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose run \
		--no-deps \
		oas-service \
		npm run start

test-integration: ensure-dotenv
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose run \
		oas-service \
		npm run test-integration

up: ensure-dotenv
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose up \
		${SERVICE}
