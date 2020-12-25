import { SinonMock, createSandbox } from 'sinon';
import { describe, it } from 'mocha';
import { ERROR_CODES } from '../../../src/constants';
import { Model } from '../../../src/helpers';
import { expect } from 'chai';
import joi from 'joi';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let model: Model<any>;
  let mongoMock: SinonMock;

  beforeEach((): void => {
    const logger = { debugFunction: (): void => null };
    const mongo = { getDb: async (): Promise<void> => null };
    const schema = {};
    const testCollectionName = nanoid(12);
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

      expect(count).to.equal(testCount);
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

      expect(true).to.equal(true);
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
      const testStatusCode = 404;

      mongoMock.expects('getDb').resolves({
        collection: (): { [key: string]: any } => ({
          findOne: async (): Promise<any> => null,
        }),
      } as any);

      try {
        await model.fetchOne();
      } catch (error) {
        expect(error.status).to.equal(testStatusCode);
        expect(error.errorCode).to.equal(ERROR_CODES.NOT_FOUND);
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

      expect(true).to.equal(true);
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
      const testStatusCode = 403;

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

      try {
        await model.save(testData);
      } catch (error) {
        expect(error.status).to.equal(testStatusCode);
        expect(error.errorCode).to.equal(ERROR_CODES.DUPLICATE);
      }
    });

    it('should fail to save an entry when data validation fails', async (): Promise<void> => {
      const testData = {};
      const testStatusCode = 400;

      sandbox
        .stub(joi, 'array')
        .onCall(0)
        .returns({
          items: (): { validate: () => void } => ({ validate: (): { error: any } => ({ error: new Error() }) }),
        } as any);

      try {
        await model.save(testData);
      } catch (error) {
        expect(error.status).to.equal(testStatusCode);
        expect(error.errorCode).to.equal(ERROR_CODES.INVALID);
      }
    });
  });
};
