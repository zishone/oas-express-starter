# oas-express-starter
[![Build Status](https://travis-ci.org/zishone/oas-express-starter.svg?branch=master)](https://travis-ci.org/zishone/oas-express-starter) [![License](https://img.shields.io/github/license/zishone/oas-express-starter)](https://github.com/zishone/oas-express-starter/blob/master/LICENSE)

A starter template for an OpenAPI 3.0 compliant Express.js server using TypeScript.

## Getting started
- Clone the repository
```
git clone --depth=1 https://github.com/zishone/oas-express-starter.git <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm run build
npm start
```

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
This project is licensed under the MIT License - see the [LICENSE](https://github.com/zishone/oas-express-starter/blob/master/LICENSE) file for details.
