import { NextFunction, Request, Response } from 'express';
import { NoteService } from '../../../../services';
import { paginate } from '../../../../utils';

/**
 * POST /api/v1/user/notes
 */
export const postUserNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService(req.logger, req.database);

    const { id: userId } = req.user;
    const { title, body } = req.body;

    const { note } = await noteService.createNote(userId, title, body);

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
    const noteService = new NoteService(req.logger, req.database);

    const { filter, options } = req.mquery;
    const { id: userId } = req.user;

    const { noteCount, notes } = await noteService.fetchNotes(
      {
        ...filter,
        userId,
      },
      options,
    );
    const pagination = paginate(noteCount, options.limit);

    res.jsend.success({
      pagination,
      notes,
    });
  } catch (error) {
    next(error);
  }
};
