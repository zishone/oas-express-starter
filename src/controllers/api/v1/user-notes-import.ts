import { NextFunction, Request, Response } from 'express';
import { createReadStream, unlinkSync } from 'fs';
import { Note } from 'models';
import { NoteService } from '../../../services';
import { parseStream } from 'fast-csv';

/**
 * POST /api/v1/user/notes/import
 */
export const postUserNotesImportV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteService = new NoteService();

    const { id: userId } = req.user;

    const fileStream = createReadStream(req.file.path);
    const csvStream = parseStream(fileStream, { headers: true });
    const { title, body }: Note = await new Promise((resolve, reject) => {
      csvStream.on('data', resolve);
      csvStream.on('error', reject);
    });
    const { note } = await noteService.createNote(userId, title, body);
    unlinkSync(req.file.path);

    res.jsend.success({ note }, 201);
  } catch (error) {
    next(error);
  }
};
