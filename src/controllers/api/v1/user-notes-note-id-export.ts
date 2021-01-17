import { NextFunction, Request, Response } from 'express';
import { NoteService } from '../../../services';
import { writeToBuffer } from 'fast-csv';

/**
 * GET /api/v1/user/notes/{nodeId}/export
 */
export const getUserNotesByIdExport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService();

    const { noteId } = req.params;
    const { options } = req.mquery;

    const { note } = await noteService.fetchNoteById(noteId, options);

    const buffer = await writeToBuffer([note], { headers: true });

    res.attachment('note.csv');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};