# oas-express-starter
[![Build Status](https://github.com/SuperInitialize/oas-express-starter/workflows/CI/badge.svg)](https://github.com/SuperInitialize/oas-express-starter/actions?query=workflow%3ACI) [![License](https://img.shields.io/github/license/SuperInitialize/oas-express-starter)](https://github.com/SuperInitialize/oas-express-starter/blob/master/LICENSE)

A starter template for an OpenAPI 3.0 compliant Express.js server using TypeScript.

## Getting started
* Clone the repository
```
git clone --depth=1 https://github.com/SuperInitialize/oas-express-starter.git <project_name>
```

* Rename `.env.sample` to `.env` then modify for your configurations.

* Install dependencies
```shell
npm install
```

* Build
```shell
npm run build
```

* Start
```shell
npm run start
```

* Build, Start, and Watch
```shell
npm run watch
```

## Configuration
Example `.env` file:
```
NODE_ENV=development

CONFIG_CORS_ORIGIN=*
CONFIG_CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CONFIG_CORS_CREDENTIALS=true

CONFIG_APP_PORT=3000

CONFIG_DB_URI=mongodb://127.0.0.1:27017
CONFIG_DB_NAME=oasDB

CONFIG_SALT_ROUNDS=12               # Rounds to generate salt for generating password
CONFIG_SALT_KEY=salt                # Salt for generating IDs for records

CONFIG_LOGIN_SECRET=login_secret    # Secret for generating JWT login tokens
CONFIG_LOGIN_TTL=2592000            # Time to live of login in seconds
```

## Environments
- `production` - for production
- `staging` - for staging
- `testing` - for running unit tests (This is automatically set so don't worry about this)
- `develop` - for development

## Testing
* Test
```shell
npm run test
```

* Coverage
```shell
npm run test:coverage
```
Generated Coverage Report: `./coverage/lcov-report/index.html`

## Docker
* Using `docker`
```shell
docker build -t oas-backend:latest .
docker run -it -p 3000:3000 --env-file .env oas-backend:latest
```

* Using `docker-compose`
```shell
docker-compose build
docker-compose up
```

## API Documentation
When `NODE_ENV` is set to `development` or `staging`, swagger API documentations will be available at: `/apidocs`.

## Project Structure
| Name                      | Description                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| **dist**                  | Contains the distributable (or output) from your TypeScript build. This is the code you ship. |
| **test**                  | Contains your tests. Separate from source because there is a different build process.         |
| **src**                   | Contains your source code that will be compiled to the dist dir.                              |
| **src/config**            | Contains your configuration files.                                                            |
| **src/constants**         | Contains your constants.                                                                      |
| **src/controllers**       | Contains your controllers to handle various http requests.                                    |
| **src/helpers**           | Contains your resuable helper classes.                                                        |
| **src/middlewares**       | Contains your custom middlewares.                                                             |
| **src/models**            | Contains your schema definitions using [@hapi/joi](https://www.npmjs.com/package/@hapi/joi).  |
| **src/openapi**           | Contains your OpenAPI 3.0 specification written as JSON.                                      |
| **src/services**          | Contains your services, this is where you will put your business logic.                       |
| **src/types**             | Contains .d.ts files not found on DefinitelyTyped. Covered more in this section.              |
| **src/utils**             | Contains your reusable stateless utility functions.                                           |
| **src**/app.ts            | Configurations for you express app.                                                           |
| **src**/server.ts         | Entry point to your express app.                                                              |

## Authors
* **Zishran Julbert Garces**

See also the list of [contributors](https://github.com/zishone/oas-express-starter/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/SuperInitialize/oas-express-starter/blob/master/LICENSE) file for details.
