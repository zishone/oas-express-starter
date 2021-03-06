import { NextFunction, Request, Response } from 'express';
import { NoteService } from '../../../services';
import { paginate } from '../../../utils';

/**
 * POST /api/v1/user/notes
 */
export const postUserNotesV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService();

    const { id: userId } = req.user;
    const { title, body } = req.body;

    req.info['user.id'] = userId;

    const { note } = await noteService.createNote(userId, title, body);

    req.info['note.id'] = note.id;

    res.jsend.success({ note }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/user/notes
 */
export const getUserNotesV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService();

    const { filter, options } = req.mquery;
    const { id: userId } = req.user;

    req.info['user.id'] = userId;

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
