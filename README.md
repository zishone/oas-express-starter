# oas-express-starter
[![Build](https://github.com/zishone/oas-express-starter/workflows/ci/badge.svg)](https://github.com/zishone/oas-express-starter/actions?query=workflow%3Aci) [![Coverage](https://codecov.io/gh/zishone/oas-express-starter/branch/master/graph/badge.svg)](https://codecov.io/gh/zishone/oas-express-starter) [![License](https://img.shields.io/github/license/zishone/oas-express-starter)](https://github.com/zishone/oas-express-starter/blob/master/LICENSE)

A starter template for an OpenAPI 3.0 compliant Express.js server using TypeScript with MongoDB.

### More Details
See [Medium Blog Post](https://link.medium.com/cV2OAK6v3db).

## Quick Start
* Clone the repository
```
git clone --depth=1 https://github.com/zishone/oas-express-starter.git <project_name>
```

* Install dependencies
```shell
npm ci
```

* Build
```shell
npm run build
```

* Start
```shell
npm run start
```

## Configuration (dotenv)
```
NODE_ENV=development

CONFIG_APP_PORT=3000

CONFIG_DB_URI=mongodb://127.0.0.1:27017
CONFIG_DB_NAME=oasDB

CONFIG_LOGIN_SECRET=login_secret    # Secret for generating JWT login tokens
CONFIG_LOGIN_TTL=2592000            # Time to live of login in seconds
```

## Environments
- `production` - for production
- `staging` - for staging
- `unit` - for running unit tests (This is automatically set)
- `integration` - for running integration tests (This is automatically set)
- `development` - for development

## Swagger UI
Should be available on route `/apidocs` when NODE_ENV is set to `development`.

## NPM Scripts
* `npm run` **`migrate:up`**
  * To migrate database up using migrations in `./db/migrations`.
* `npm run` **`migrate:down`**
  * To migrate database one step down.
* `npm run` **`migrate:create`** **`<description>`**
  * To create new migration in `./db/migrations`.
* `npm run` **`lint`**
  * To check for lint issues.
* `npm run` **`lint:fix`**
  * To check and fix lint issues.
* `npm run` **`test`**
  * To run unit tests.
* `npm run` **`test:coverage`**
  * To run unit tests and generate coverage report in `./.data/tests/unit`.
* `npm run` **`test-integration`**
  * To run integration tests.
* `npm run` **`test-integration:coverage`**
  * To run integration tests and generate coverage report in `./.data/tests/integration`.
* `npm run` **`build`**
  * To compile typescript into `./dist`.
* `npm run` **`build:watch`**
  * To watch for changes and recompile typescript.
* `npm run` **`start`**
  * To start service.
* `npm run` **`start:watch`**
  * To watch for changes and restart service.
* `npm run` **`watch`**
  * To watch for changes and recompile typescript and restart service.

## Makefile Targets
* `make` **`build`**
  * To build docker image of the service. Uses the name and version in `package.json` to tag the image as `<name>:v<version>`.
* `make` **`up`**
  * To start container of the service and also mongodb. Logs and mongodb data will be available at `./.data`, it is mounted as a volume in those containers.
* `make` **`down`**
  * To stop the running containers.
* `make` **`run`**
  * To run start the service inside a container and watch for changes. No need to rebuild because this mounts the whole repository's directory as a volume then executes `npm run watch`.
* `make` **`test`**
  * To run unit test inside a container. Coverage report will be available in `./.data/tests/unit`.
* `make` **`test-integration`**
  * To run integration test inside a container. Coverage report will be available in `./.data/tests/integration`.

## Project Structure
| Name                      | Description                                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **db/migrations**         | Contains database migrations.                                                                                                                                                 |
| **src/configs**           | Contains configuration files and the config builder from environment variables.                                                                                               |
| **src/constants**         | Contains constant definitions.                                                                                                                                                |
| **src/controllers**       | Contains controllers to handle various http requests.                                                                                                                         |
| **src/helpers**           | Contains resuable helper classes.                                                                                                                                             |
| **src/middlewares**       | Contains middlewares.                                                                                                                                                         |
| **src/models**            | Contains entity schema definitions and instatiation of models to access the database.                                                                                         |
| **src/openapi**           | Contains OpenAPI 3.0 specification in JSON format.                                                                                                                            |
| **src/services**          | Contains services, this is where ther business logic lives.                                                                                                                   |
| **src/types**             | Contains .d.ts files not found on DefinitelyTyped. Covered more in this section.                                                                                              |
| **src/utils**             | Contains your reusable stateless utility functions.                                                                                                                           |
| **src**/app.ts            | Configurations for you express app.                                                                                                                                           |
| **src**/server.ts         | Entry point to your express app.                                                                                                                                              |
| **tests/integration**     | Contains integration tests.                                                                                                                                                   |
| **tests/unit**            | Contains unit tests.                                                                                                                                                          |
| .env.defaults             | Contains default configuration values, if either .env doesn't exist, or .env only contains partial cofigurations, this will be where the default values will be loaded from.  |

## Authors
* **Zishran Garces**

See also the list of [contributors](https://github.com/zishone/oas-express-starter/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/zishone/oas-express-starter/blob/master/LICENSE) file for details.
