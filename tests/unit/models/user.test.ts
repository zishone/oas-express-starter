import { describe, it } from 'mocha';
import { ROLES } from '../../../src/constants';
import { UserModel } from '../../../src/models';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let userModel: UserModel;

  beforeEach((): void => {
    const logger = { debugFunctionCall: (): void => null };
    const mongo = { getDb: async (): Promise<void> => null };
    userModel = new UserModel(logger as any, mongo as any);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('create', (): void => {
    it('should create a user object', async (): Promise<void> => {
      const testUsername = nanoid(12);
      const testEmail = nanoid(12);
      const testSaltedPassword = nanoid(12);
      const testName = nanoid(12);

      const { username, email, password, name, role, createdOn } = userModel.create(
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
    });
  });
};
