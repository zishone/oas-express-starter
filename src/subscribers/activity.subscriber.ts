import { ActivityModel } from '../models';
import { EventEmitter } from 'events';
import { Logger } from '../helpers';
import { User } from 'express';

export const activitySubscriber = (logger: Logger, emitter: EventEmitter, activityModel: ActivityModel): void => {
  emitter.on('activity', async ({ user, type }: { user: User, type: string }) => {
    try {
      // TODO: Make this into a service
      await activityModel.save(activityModel.create(user.id, type));
    } catch (error) {
      // TODO: log error
    }
  });
};
