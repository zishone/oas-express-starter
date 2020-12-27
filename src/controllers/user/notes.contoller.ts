import { NextFunction, Request, Response } from 'express';
import { NoteService } from '../../services';
import { paginate } from '../../utils';

/**
 * POST /api/v1/user/notes
 */
export const postUserNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService(req.logger, req.mongo);

    const { id: userId } = req.user;
    const { title, body } = req.body;

    const { note } = await noteService.createUserNote(userId, title, body);

    res.jsend.success({ note }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/user/notes
 */
export const getUserNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService(req.logger, req.mongo);

    const { filter, options } = req.mquery;
    const { id: userId } = req.user;

    const { noteCount, notes } = await noteService.fetchUserNotes(userId, filter, options);
    const pagination = paginate(noteCount, options.limit);

    res.jsend.success({
      pagination,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/user/notes/{id}
 */
export const getUserNotesById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService(req.logger, req.mongo);

    const { noteId } = req.params;
    const { id: userId } = req.user;
    const { options } = req.mquery;

    const { note } = await noteService.fetchUserNoteById(userId, noteId, options);

    res.jsend.success({ note });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/user/notes/{id}
 */
export const patchUserNotesById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService(req.logger, req.mongo);

    const { noteId } = req.params;
    const { id: userId } = req.user;
    const { title, body } = req.body;

    await noteService.updateUserNoteById(userId, noteId, {
      title,
      body,
    });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/user/notes/{id}
 */
export const deleteUserNotesById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService(req.logger, req.mongo);

    const { noteId } = req.params;
    const { id: userId } = req.user;

    await noteService.deleteUserNoteById(userId, noteId);

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
