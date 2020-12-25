.PHONY: build test run test-integration up

define readPackageJson
	$(shell node -p "require('./package.json').$(1)")
endef

APP_NAME		:= $(firstword $(subst :, ,$(call readPackageJson,name)))
APP_VERSION	:= $(firstword $(subst :, ,$(call readPackageJson,version)))

build:
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose build \
		${SERVICE}

test:
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose run \
		--no-deps \
		oas-service \
		npm run test

run:
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose run \
		--no-deps \
		oas-service \
		npm run start

test-integration:
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose run \
		oas-service \
		npm run test-integration

up:
	APP_NAME=${APP_NAME} \
	APP_VERSION=${APP_VERSION} \
	docker-compose up \
		${SERVICE}
