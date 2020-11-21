import {
  Logger,
  Mongo,
} from '../helpers';
import { ActivityService } from '../services';
import { EventEmitter } from 'events';
import { STATES } from '../constants';
import { extractIp } from '../utils';

const logger = new Logger('subscriber', __filename);

export const activitySubscriber = (mongo: Mongo, emmiter: EventEmitter): any => {
  emmiter.on('activity', async ({ req, user, type, state }) => {
    try {
      logger.debug(req.id, 'activitySubscriber', STATES.BEGUN, `activity.${type}.${state}`);
      const activityService = new ActivityService(req.id, mongo);
      const ip = extractIp(req);
      await activityService.addActivity(user.userId, type, state, ip)
        .catch((error: any) => {
          throw error;
        })
      logger.debug(req.id, 'activitySubscriber', STATES.SUCCEEDED, `activity.${type}.${state}`);
    } catch (error) {
      logger.fatal(req.id, 'activitySubscriber', error);
    }
  });
};
