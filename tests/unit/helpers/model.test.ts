import { COLLECTIONS, ERROR_CODES } from '../../../src/constants';
import { SinonMock, createSandbox } from 'sinon';
import { describe, it } from 'mocha';
import { Model } from '../../../src/helpers';
import { expect } from 'chai';
import httpError from 'http-errors';
import joi from 'joi';

export default (): void => {
  const sandbox = createSandbox();
  let model: Model<any>;
  let mongoMock: SinonMock;

  beforeEach((): void => {
    const logger = { debugFunction: (): void => null };
    const mongo = {
      getDb: async (): Promise<void> => null,
      error: () => {
        throw new Error();
      },
    };
    const schema = {};
    const testCollectionName = COLLECTIONS.USERS;
    mongoMock = sandbox.mock(mongo);
    model = new Model<any>(logger as any, mongo as any, schema as any, testCollectionName);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('count', (): void => {
    it('should return count of entries in database', async (): Promise<void> => {
      const testCount = 1;

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          countDocuments: async (): Promise<number> => testCount,
        }),
      } as any);

      const count = await model.count();

      expect(count).to.be.equal(testCount);
    });

    it('should fail to return count when database error happens', async (): Promise<void> => {
      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
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
      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          find: (): any => {},
        }),
      } as any);

      await model.fetch();

      expect(true).to.be.equal(true);
    });

    it('should fail to return list of entries when database error happens', async (): Promise<void> => {
      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          find: (): any => {
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
      const testData = {};

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          findOne: async (): Promise<any> => testData,
        }),
      } as any);

      const data = await model.fetchOne();

      expect(data).to.deep.equal(testData);
    });

    it('should fail to return an entry when database error happens', async (): Promise<void> => {
      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
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
      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          findOne: async (): Promise<any> => null,
        }),
      } as any);
      mongoMock.expects('error').throws(httpError(404, { errorCode: ERROR_CODES.NOT_FOUND }));

      try {
        await model.fetchOne();
      } catch (error) {
        expect(error.status).to.be.equal(404);
        expect(error.errorCode).to.be.equal(ERROR_CODES.NOT_FOUND);
      }
    });
  });

  describe('aggregate<any>', (): void => {
    it('should aggregate list of entries in database', async (): Promise<void> => {
      const testPipeline = [{}];

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          aggregate: (): any => {},
        }),
      } as any);

      await model.aggregate<any>(testPipeline);

      expect(true).to.be.equal(true);
    });

    it('should fail to aggregate list of entries when database error happens', async (): Promise<void> => {
      const testPipeline = [{}];

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          aggregate: (): any => {
            throw new Error();
          },
        }),
      } as any);

      try {
        await model.aggregate<any>(testPipeline);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe('save', (): void => {
    it('should save an entry in the database', async (): Promise<void> => {
      const testData = {};

      sandbox
        .stub(joi, 'array')
        .onCall(0)
        .returns({
          items: (): { validate: () => void } => ({ validate: (): { value: any } => ({ value: [testData] }) }),
        } as any);
      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          insertMany: async (): Promise<void> => null,
        }),
      } as any);

      const [id] = await model.save(testData);

      expect(id).to.be.a('string');
    });

    it('should save multiple entries in the database', async (): Promise<void> => {
      const testData = [{}];

      sandbox
        .stub(joi, 'array')
        .onCall(0)
        .returns({
          items: (): { validate: () => void } => ({ validate: (): { value: any } => ({ value: testData }) }),
        } as any);
      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          insertMany: async (): Promise<void> => null,
        }),
      } as any);

      const [id] = await model.save(testData);

      expect(id).to.be.a('string');
    });

    it('should fail to save an entry when database error happens', async (): Promise<void> => {
      const testData = {};

      sandbox
        .stub(joi, 'array')
        .onCall(0)
        .returns({
          items: (): { validate: () => void } => ({ validate: (): { value: any } => ({ value: [testData] }) }),
        } as any);
      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
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
      const testData = {};

      sandbox
        .stub(joi, 'array')
        .onCall(0)
        .returns({
          items: (): { validate: () => void } => ({ validate: (): { value: any } => ({ value: [testData] }) }),
        } as any);
      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          insertMany: async (): Promise<any> => {
            throw { code: 11000 };
          },
        }),
      } as any);
      mongoMock.expects('error').throws(httpError(403, { errorCode: ERROR_CODES.DUPLICATE }));

      try {
        await model.save(testData);
      } catch (error) {
        expect(error.status).to.be.equal(403);
        expect(error.errorCode).to.be.equal(ERROR_CODES.DUPLICATE);
      }
    });

    it('should fail to save an entry when data validation fails', async (): Promise<void> => {
      const testData = {};

      sandbox
        .stub(joi, 'array')
        .onCall(0)
        .returns({
          items: (): { validate: () => void } => ({ validate: (): { error: any } => ({ error: new Error() }) }),
        } as any);

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

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          updateMany: async (): Promise<void> => null,
        }),
      } as any);

      await model.update(testFilter, testUpdate);

      expect(true).to.be.equal(true);
    });

    it('should fail to update entries when update object was given', async (): Promise<void> => {
      const testFilter = {};
      const testUpdate = {};

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
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

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
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

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          updateMany: async (): Promise<any> => {
            throw { code: 11000 };
          },
        }),
      } as any);
      mongoMock.expects('error').throws(httpError(403, { errorCode: ERROR_CODES.DUPLICATE }));

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

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          deleteMany: async (): Promise<any> => {},
        }),
      } as any);

      await model.delete(testFilter);

      expect(true).to.be.equal(true);
    });

    it('should fail to delete entries when database error happens', async (): Promise<void> => {
      const testFilter = {};

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
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
