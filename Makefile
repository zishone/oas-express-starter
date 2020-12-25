.PHONY:   build up test run test-integration 

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

set-environments:
export APP_NAME=${CONFIG_APP_NAME}
export APP_VERSION=${CONFIG_APP_VERSION}
export APP_PORT=${CONFIG_APP_PORT}

build: ensure-dotenv set-environments
	docker-compose build \
		${SERVICE}

up: build
	docker-compose up \
		${SERVICE}

test: build
	docker-compose run \
		-v [./.data=/app/.data] \
		--no-deps \
		oas-service \
		npm run test:coverage

run: build
	docker-compose run \
		-v [./.data=/app/.data] \
		--no-deps \
		oas-service \
		npm run start

test-integration: build
	docker-compose up -d mongodb-integration && \
	docker-compose run \
		-v [./.data=/app/.data] \
		--no-deps \
		oas-service \
		npm run test-integration:coverage
