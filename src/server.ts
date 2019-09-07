import { App } from './app';
import { appConfig } from './config';

new App()
  .initialize()
  .then((app) => {
    app.listen({ port: appConfig.port }, () => {
      console.log('INFO: Accepting connections at http://localhost:', appConfig.port);
    });
  });
