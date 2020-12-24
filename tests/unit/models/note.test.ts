import { describe, it } from 'mocha';
import { NoteModel } from '../../../src/models';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default (): void => {
  describe('NoteModel', (): void => {
    let noteModel: NoteModel;
    const sandbox = createSandbox();
    const testData: { [key: string]: any } = {};

    beforeEach((): void => {
      const logger = { debugFunction: sandbox.spy() };
      const mongo = { getDb: sandbox.spy() };
      noteModel = new NoteModel(logger as any, mongo as any);
      testData.testUserId = nanoid(12);
      testData.testTitle = nanoid(12);
      testData.testBody = nanoid(12);
    });

    afterEach((): void => {
      sandbox.restore();
    });

    describe('create', (): void => {
      it('should create a note object', async (): Promise<void> => {
        const { testUserId, testTitle, testBody } = testData;

        const { id, userId, title, body, createdOn } = noteModel.create(testUserId, testTitle, testBody);

        expect({ userId, title, body }).to.deep.equal({ userId: testUserId, title: testTitle, body: testBody });
        expect(createdOn).to.be.a('number');
        expect(id).to.be.a('string');
      });
    });
  });
};
