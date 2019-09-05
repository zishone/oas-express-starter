import { init } from './app';
import { appConfig } from './config';

init()
.then((app) => {
  app.listen({ port: appConfig.port }, () => {
    console.log('INFO: Accepting connections at http://localhost:', appConfig.port);
  });
});
