import * as cv from 'class-validator';
import { COLLECTIONS, ERROR_CODES } from '../../../src/constants';
import { Cursor, Model } from '../../../src/helpers';
import { SinonMock, createSandbox } from 'sinon';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import httpError from 'http-errors';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let model: Model<any>;
  let dbMock: SinonMock;

  beforeEach((): void => {
    const logger = { debugFunctionCall: (): void => null };
    const database = {
      getConnection: async (): Promise<void> => null,
      error: (): void => {
        throw new Error();
      },
    };
    const testCollectionName = COLLECTIONS.USERS;
    dbMock = sandbox.mock(database);
    model = new Model<any>(logger as any, database as any, testCollectionName);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('count', (): void => {
    it('should return count of entries in database', async (): Promise<void> => {
      const testCount = 1;

      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          countDocuments: async (): Promise<number> => testCount,
        }),
      } as any);

      const count = await model.count();

      expect(count).to.be.equal(testCount);
    });

    it('should fail to return count when database error happens', async (): Promise<void> => {
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          countDocuments: async (): Promise<number> => {
            throw new Error();
          },
        }),
      } as any);

      try {
        await model.count();
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe('fetch', (): void => {
    it('should return list of entries in database', async (): Promise<void> => {
      const findSpy = sandbox.spy();
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          find: findSpy,
        }),
      } as any);

      await model.fetch();

      expect(findSpy.calledOnce).to.be.equal(true);
    });

    it('should fail to return list of entries when database error happens', async (): Promise<void> => {
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          find: (): Cursor => {
            throw new Error();
          },
        }),
      } as any);

      try {
        await model.fetch();
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe('fetchOne', (): void => {
    it('should return an entry from the database', async (): Promise<void> => {
      const testData = { id: nanoid(12) };

      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          findOne: async (): Promise<any> => testData,
        }),
      } as any);

      const data = await model.fetchOne();

      expect(data).to.deep.equal(testData);
    });

    it('should fail to return an entry when database error happens', async (): Promise<void> => {
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          findOne: async (): Promise<any> => {
            throw new Error();
          },
        }),
      } as any);

      try {
        await model.fetchOne();
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it('should fail to return an entry when data was not found', async (): Promise<void> => {
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          findOne: async (): Promise<any> => null,
        }),
      } as any);
      dbMock.expects('error').throws(httpError(404, { errorCode: ERROR_CODES.NOT_FOUND }));

      try {
        await model.fetchOne();
      } catch (error) {
        expect(error.status).to.be.equal(404);
        expect(error.errorCode).to.be.equal(ERROR_CODES.NOT_FOUND);
      }
    });
  });

  describe('save', (): void => {
    it('should save an entry in the database', async (): Promise<void> => {
      const testData = { id: nanoid(12) };

      sandbox.stub(cv, 'validateOrReject').onCall(0).resolves();
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          insertMany: async (): Promise<void> => null,
        }),
      } as any);

      const [id] = await model.save(testData);

      expect(id).to.be.a('string');
    });

    it('should save multiple entries in the database', async (): Promise<void> => {
      const testData = [{ id: nanoid(12) }];

      sandbox.stub(cv, 'validateOrReject').resolves();
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          insertMany: async (): Promise<void> => null,
        }),
      } as any);

      const [id] = await model.save(testData);

      expect(id).to.be.a('string');
    });

    it('should fail to save an entry when database error happens', async (): Promise<void> => {
      const testData = { id: nanoid(12) };

      sandbox.stub(cv, 'validateOrReject').onCall(0).resolves();
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          insertMany: async (): Promise<any> => {
            throw new Error();
          },
        }),
      } as any);

      try {
        await model.save(testData);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it('should fail to save an entry when data has duplicate', async (): Promise<void> => {
      const testData = { id: nanoid(12) };

      sandbox.stub(cv, 'validateOrReject').onCall(0).resolves();
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          insertMany: async (): Promise<any> => {
            throw { code: 11000 };
          },
        }),
      } as any);
      dbMock.expects('error').throws(httpError(403, { errorCode: ERROR_CODES.DUPLICATE }));

      try {
        await model.save(testData);
      } catch (error) {
        expect(error.status).to.be.equal(403);
        expect(error.errorCode).to.be.equal(ERROR_CODES.DUPLICATE);
      }
    });

    it('should fail to save an entry when data validation fails', async (): Promise<void> => {
      const testData = { id: nanoid(12) };

      sandbox.stub(cv, 'validateOrReject').onCall(0).rejects(new Error());

      try {
        await model.save(testData);
      } catch (error) {
        expect(error.status).to.be.equal(400);
        expect(error.errorCode).to.be.equal(ERROR_CODES.INVALID);
      }
    });
  });

  describe('update', (): void => {
    it('should update entries in the database', async (): Promise<void> => {
      const testFilter = {};
      const testUpdate = {
        $set: {},
        $unset: {},
      };

      const updateManySpy = sandbox.spy();
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          updateMany: updateManySpy,
        }),
      } as any);

      await model.update(testFilter, testUpdate);

      expect(updateManySpy.calledOnce).to.be.equal(true);
    });

    it('should fail to update entries when update object was given', async (): Promise<void> => {
      const testFilter = {};
      const testUpdate = {};

      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          updateMany: async (): Promise<any> => {
            throw new Error();
          },
        }),
      } as any);

      try {
        await model.update(testFilter, testUpdate);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it('should fail to update entries when database error happens', async (): Promise<void> => {
      const testFilter = {};
      const testUpdate = {
        $set: {},
        $unset: {},
      };

      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          updateMany: async (): Promise<any> => {
            throw { code: 16840 };
          },
        }),
      } as any);

      try {
        await model.update(testFilter, testUpdate);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it('should fail to update entries when update will result in a duplicate', async (): Promise<void> => {
      const testFilter = {};
      const testUpdate = {
        $set: {},
        $unset: {},
      };

      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          updateMany: async (): Promise<any> => {
            throw { code: 11000 };
          },
        }),
      } as any);
      dbMock.expects('error').throws(httpError(403, { errorCode: ERROR_CODES.DUPLICATE }));

      try {
        await model.update(testFilter, testUpdate);
      } catch (error) {
        expect(error.status).to.be.equal(403);
        expect(error.errorCode).to.be.equal(ERROR_CODES.DUPLICATE);
      }
    });
  });

  describe('delete', (): void => {
    it('should delete entries from database', async (): Promise<void> => {
      const testFilter = {};

      const deleteManySpy = sandbox.spy();
      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          deleteMany: deleteManySpy,
        }),
      } as any);

      await model.delete(testFilter);

      expect(deleteManySpy.calledOnce).to.be.equal(true);
    });

    it('should fail to delete entries when database error happens', async (): Promise<void> => {
      const testFilter = {};

      dbMock.expects('getConnection').resolves({
        collection: (): { [key: string]: Function } => ({
          deleteMany: async (): Promise<any> => {
            throw new Error();
          },
        }),
      } as any);

      try {
        await model.delete(testFilter);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
};
