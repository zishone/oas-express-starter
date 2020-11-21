import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Logger } from '../../helpers';
import { NoteService } from '../../services';
import { STATES } from '../../constants';

const logger = new Logger('controller', __filename);

/**
 * POST /api/v1/user/notes
 */
export const postUserNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debug(req.id, 'postUserNotes', STATES.BEGUN);
    const noteService = new NoteService(req.id, req.mongo);

    const { userId } = req.user;
    const {
      title,
      body,
    } = req.body;

    const { noteId } = await noteService.addNote(userId, title, body)
      .catch((error: any) => {
        throw error;
      });
    const { note } = await noteService.fetchNote({ noteId })
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'postUserNotes', STATES.SUCCEEDED);
    res.jsend.success({ note }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/user/notes
 */
export const getUserNotes = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'getUserNotes', STATES.BEGUN);
    const noteService = new NoteService(req.id, req.mongo);

    const { filter, options } = req.mquery;
    const { userId } = req.user;

    filter.userId = userId;
    const { notes } = await noteService.fetchNotes({
      ...filter,
      userId,
    }, options)
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'getUserNotes', STATES.SUCCEEDED);
    res.jsend.success({ notes });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/user/notes/{noteId}
 */
export const getUserNotesById = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'getUserNotesById', STATES.BEGUN);
    const noteService = new NoteService(req.id, req.mongo);

    const { noteId } = req.params;
    const { userId } = req.user;
    const { options } = req.mquery;

    const { note } = await noteService.fetchNote({
      userId,
      noteId,
    }, options)
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'getUserNotesById', STATES.SUCCEEDED);
    res.jsend.success({ note });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/user/notes/{noteId}
 */
export const putUserNotesById = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'putUserNotesById', STATES.BEGUN);
    const noteService = new NoteService(req.id, req.mongo);

    const { noteId } = req.params;
    const { userId } = req.user;
    const {
      title,
      body,
    } = req.body;

    await noteService.fetchNote({
      userId,
      noteId,
    })
      .catch((error: any) => {
        throw error;
      });
    await noteService.updateNote({
      userId,
      noteId,
    }, {
      title,
      body,
    })
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'putUserNotesById', STATES.SUCCEEDED);
    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/user/notes/{noteId}
 */
export const deleteUserNotesById = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'deleteUserNotesById', STATES.BEGUN);
    const noteService = new NoteService(req.id, req.mongo);

    const { noteId } = req.params;
    const { userId } = req.user;

    await noteService.fetchNote({
      userId,
      noteId,
    })
      .catch((error: any) => {
        throw error;
      });
    await noteService.deleteNote({
      userId,
      noteId,
    })
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'deleteUserNotesById', STATES.SUCCEEDED);
    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
