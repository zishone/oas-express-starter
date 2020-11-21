import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { ActivityService } from '../../services';
import { Logger } from '../../helpers';
import { STATES } from '../../constants';

const logger = new Logger('controller', __filename);

/**
 * GET /api/v1/activities
 */
export const getActivities = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'getActivities', STATES.BEGUN);
    const activityService = new ActivityService(req.id, req.mongo);

    const { filter, options, isPaginated } = req.mquery;

    const pagination: any = {};
    if (isPaginated) {
      const { activityCount } = await activityService.countActivities(filter);
      pagination.totalItemCount = activityCount;
    }
    const { activities } = await activityService.fetchActivities(filter, options)
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'getActivities', STATES.SUCCEEDED);
    res.jsend.success({
      pagination,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/activities/{activityId}
 */
export const getActivitiesById = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'getActivitiesById', STATES.BEGUN);
    const activityService = new ActivityService(req.id, req.mongo);

    const { activityId } = req.params;
    const { options } = req.mquery;

    const { activity } = await activityService.fetchActivity({ activityId }, options)
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'getActivitiesById', STATES.SUCCEEDED);
    res.jsend.success({ activity });
  } catch (error) {
    next(error);
  }
};
