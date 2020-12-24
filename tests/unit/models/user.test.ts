import { describe, it } from 'mocha';
import { ROLES } from '../../../src/constants';
import { UserModel } from '../../../src/models';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default (): void => {
  describe('UserModel', (): void => {
    let userModel: UserModel;
    const sandbox = createSandbox();
    const testData: { [key: string]: any } = {};

    beforeEach((): void => {
      const logger = { debugFunction: sandbox.spy() };
      const mongo = { getDb: sandbox.spy() };
      userModel = new UserModel(logger as any, mongo as any);
      testData.testUsername = nanoid(12);
      testData.testEmail = nanoid(12);
      testData.testSaltedPassword = nanoid(12);
      testData.testName = nanoid(12);
    });

    afterEach((): void => {
      sandbox.restore();
    });

    describe('create', (): void => {
      it('should create a user object', async (): Promise<void> => {
        const { testUsername, testEmail, testSaltedPassword, testName } = testData;

        const { id, username, email, password, name, role, createdOn } = userModel.create(
          ROLES.USER,
          testUsername,
          testEmail,
          testSaltedPassword,
          testName,
        );

        expect({
          username,
          email,
          password,
          name,
          role,
        }).to.deep.equal({
          username: testUsername,
          email: testEmail,
          password: testSaltedPassword,
          name: testName,
          role: ROLES.USER,
        });
        expect(createdOn).to.be.a('number');
        expect(id).to.be.a('string');
      });
    });
  });
};
