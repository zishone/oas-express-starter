import {
  COLLECTIONS,
  ERROR_CODES,
  STATES,
} from '../constants';
import {
  Collection,
  Fail,
  Logger,
  Mongo,
} from '../helpers';
import { ActivityModel } from '../models';

const logger = new Logger('service', __filename);

export class ActivityService {
  private activitiesModel: ActivityModel;
  private activitiesCollection: Collection;
  private reqId: string;
  private mongo: Mongo;

  constructor(reqId: string, mongo: Mongo) {
    this.reqId = reqId;
    this.mongo = mongo;
    this.activitiesModel = new ActivityModel();
    this.activitiesCollection = this.mongo.collection(COLLECTIONS.ACTIVITIES, this.activitiesModel);
  }

  public async countActivities(filter?: any, options?: any): Promise<{ activityCount: number }> {
    logger.debug(this.reqId, 'countActivities', STATES.BEGUN);
    const activityCount = await this.activitiesCollection.countDocuments(filter, options);
    logger.debug(this.reqId, 'countActivities', STATES.SUCCEEDED);
    return { activityCount };
  }

  public async fetchActivities(filter?: any, options?: any): Promise<{ activities: any[] }> {
    logger.debug(this.reqId, 'fetchActivities', STATES.BEGUN);
    const cursor = await this.activitiesCollection.find(filter, options);
    const activities = await cursor.toArray();
    logger.debug(this.reqId, 'fetchActivities', STATES.SUCCEEDED);
    return { activities };
  }

  public async fetchActivity(filter?: any, options?: any): Promise<{ activity: any }> {
    logger.debug(this.reqId, 'fetchActivity', STATES.BEGUN);
    const activity = await this.activitiesCollection.findOne(filter, options);
    if (!activity) {
      throw new Fail(404)
        .error({
          errorCode: ERROR_CODES.NOT_FOUND,
          keys: ['activity'],
          message: 'Activity does not exist.',
        })
        .build();
    }
    logger.debug(this.reqId, 'fetchActivity', STATES.SUCCEEDED);
    return { activity };
  }

  public async addActivity(userId: string, type: string, state: string, ip: string): Promise<{ activityId: string }> {
    logger.debug(this.reqId, 'addActivity', STATES.BEGUN);
    const activity = this.activitiesModel.newActivity(userId, type, state, ip);
    await this.activitiesCollection.insertOne(activity);
    logger.debug(this.reqId, 'addActivity', STATES.SUCCEEDED);
    return { activityId: activity.activityId };
  }

  public async deleteActivity(filter: any): Promise<{}> {
    logger.debug(this.reqId, 'deleteActivity', STATES.BEGUN);
    await this.activitiesCollection.deleteOne(filter);
    logger.debug(this.reqId, 'deleteActivity', STATES.SUCCEEDED);
    return {};
  }

  public async deleteActivities(filter: any): Promise<{}> {
    logger.debug(this.reqId, 'deleteActivities', STATES.BEGUN);
    await this.activitiesCollection.deleteMany(filter);
    logger.debug(this.reqId, 'deleteActivities', STATES.SUCCEEDED);
    return {};
  }
}
