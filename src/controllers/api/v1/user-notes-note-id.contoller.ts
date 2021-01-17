import { NextFunction, Request, Response } from 'express';
import { NoteService } from '../../../services';

/**
 * GET /api/v1/user/notes/{noteId}
 */
export const getUserNotesNoteIdV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService();

    const { noteId } = req.params;
    const { options } = req.mquery;

    const { note } = await noteService.fetchNoteById(noteId, options);

    res.jsend.success({ note });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/user/notes/{noteId}
 */
export const patchUserNotesNoteIdV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService();

    const { noteId } = req.params;
    const { title, body } = req.body;

    await noteService.updateNoteById(noteId, {
      title,
      body,
    });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/user/notes/{noteId}
 */
export const deleteUserNotesNoteIdV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService();

    const { noteId } = req.params;

    await noteService.deleteNoteById(noteId);

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
