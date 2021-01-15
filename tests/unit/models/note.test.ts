import { describe, it } from 'mocha';
import { NoteModel } from '../../../src/models';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let noteModel: NoteModel;

  beforeEach((): void => {
    const logger = { debugFunctionCall: (): void => null };
    const database = { getConnection: async (): Promise<void> => null };
    noteModel = new NoteModel(logger as any, database as any);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('create', (): void => {
    it('should create a note object', async (): Promise<void> => {
      const testUserId = nanoid(12);
      const testTitle = nanoid(12);
      const testBody = nanoid(12);

      const { userId, title, body } = noteModel.create(testUserId, testTitle, testBody);

      expect({
        userId,
        title,
        body,
      }).to.deep.equal({
        userId: testUserId,
        title: testTitle,
        body: testBody,
      });
    });
  });
};
