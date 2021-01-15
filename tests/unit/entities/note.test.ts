import { describe, it } from 'mocha';
import { Note } from '../../../src/entities';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();

  afterEach((): void => {
    sandbox.restore();
  });

  describe('create', (): void => {
    it('should create a note object', async (): Promise<void> => {
      const testUserId = nanoid(12);
      const testTitle = nanoid(12);
      const testBody = nanoid(12);

      const { userId, title, body } = new Note(testUserId, testTitle, testBody);

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
