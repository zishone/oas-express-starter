import { User, UserModel } from '../../../src/models';
import { describe, it } from 'mocha';
import { ERROR_CODES } from '../../../src/constants';
import { UserService } from '../../../src/services';
import bcryptjs from 'bcryptjs';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import httpError from 'http-errors';
import jsonwebtoken from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export default (): void => {
  const sandbox = createSandbox();
  let userService: UserService;

  beforeEach((): void => {
    const logger = { debugFunctionCall: (): void => null };
    const database = { getConnection: async (): Promise<void> => null };
    userService = new UserService(logger as any, database as any);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('validatePassword', (): void => {
    it('should validate password of user of the given id', async (): Promise<void> => {
      const testUser = new User();
      testUser.id = nanoid(12);
      testUser.password = nanoid(12);

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(bcryptjs, 'compareSync').onCall(0).returns(true);

      const isMatch = await userService.validatePassword(testUser.id, testUser.password);

      expect(isMatch).to.be.equal(true);
    });

    it('should fail when given password is invalid', async (): Promise<void> => {
      const testUser = new User();
      testUser.id = nanoid(12);
      testUser.password = nanoid(12);

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(bcryptjs, 'compareSync').onCall(0).returns(false);

      try {
        await userService.validatePassword(testUser.id, testUser.password);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe('registerUser', (): void => {
    it('should register new user to the database', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testSalt = nanoid(12);
      const testUser = new User();
      testUser.id = nanoid(12);
      testUser.password = nanoid(12);
      testUser.username = nanoid(12);
      testUser.email = nanoid(12);
      testUser.name = nanoid(12);

      sandbox.stub(bcryptjs, 'genSaltSync').onCall(0).returns(testSalt);
      sandbox.stub(bcryptjs, 'hashSync').onCall(0).returns(testUser.password);
      sandbox.stub(UserModel.prototype, 'create').onCall(0).returns(testUser);
      sandbox.stub(UserModel.prototype, 'save').onCall(0).resolves([testUser.id]);
      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);

      const { user } = await userService.registerUser(testUser.username, testUser.email, testPassword, testUser.name);

      expect(user).to.deep.equal(testUser);
    });
  });

  describe('authenticateUser', (): void => {
    it('should authenticate user', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testAccessToken = nanoid(12);
      const testUser = new User();
      testUser.username = nanoid(12);

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(UserService.prototype, 'validatePassword').onCall(0).resolves(true);
      sandbox
        .stub(jsonwebtoken, 'sign')
        .onCall(0)
        .returns(testAccessToken as any);

      const { accessToken } = await userService.authenticateUser(testUser.username, testPassword);

      expect(accessToken).to.deep.equal(testAccessToken);
    });

    it('should fail user authentication when user does not exist', async (): Promise<void> => {
      const testUsername = nanoid(12);
      const testPassword = nanoid(12);

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).rejects(httpError(404));

      try {
        await userService.authenticateUser(testUsername, testPassword);
      } catch (error) {
        expect(error.status).to.be.equal(401);
        expect(error.errorCode).to.be.equal(ERROR_CODES.UNAUTHENTICATED);
      }
    });

    it('should fail user authentication when fetch from database fails', async (): Promise<void> => {
      const testUsername = nanoid(12);
      const testPassword = nanoid(12);

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).rejects(new Error());

      try {
        await userService.authenticateUser(testUsername, testPassword);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it('should fail user authentication when password does not match', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testUser = new User();
      testUser.password = nanoid(12);
      testUser.username = nanoid(12);

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(UserService.prototype, 'validatePassword').onCall(0).rejects({ status: 403 });

      try {
        await userService.authenticateUser(testUser.username, testPassword);
      } catch (error) {
        expect(error.status).to.be.equal(401);
        expect(error.errorCode).to.be.equal(ERROR_CODES.UNAUTHENTICATED);
      }
    });
  });

  describe('fetchUserById', (): void => {
    it('should return user fetched from the database given user id', async (): Promise<void> => {
      const testUser = new User();
      testUser.id = nanoid(12);

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);

      const { user } = await userService.fetchUserById(testUser.id);

      expect(user).to.deep.equal(testUser);
    });
  });

  describe('fetchUsers', (): void => {
    it('should return users list fetched from the database', async (): Promise<void> => {
      const testUser = new User();
      const testUsers = [testUser];

      sandbox
        .stub(UserModel.prototype, 'fetch')
        .onCall(0)
        .resolves({
          count: async (): Promise<number> => testUsers.length,
          toArray: async (): Promise<any[]> => testUsers,
        } as any);

      const { userCount, users } = await userService.fetchUsers();

      expect(userCount).to.deep.equal(testUsers.length);
      expect(users).to.deep.equal(testUsers);
    });
  });

  describe('updateUserById', (): void => {
    it('should update user in the database given user id', async (): Promise<void> => {
      const testUser = new User();
      testUser.id = nanoid(12);
      testUser.username = nanoid(12);

      const fetchOneStub = sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      const updateStub = sandbox.stub(UserModel.prototype, 'update').onCall(0).resolves();

      await userService.updateUserById(testUser.id, { username: testUser.username });

      expect(fetchOneStub.calledOnce).to.be.equal(true);
      expect(updateStub.calledOnce).to.be.equal(true);
    });

    it('should update hash user password when password is being updated', async (): Promise<void> => {
      const testSalt = nanoid(12);
      const testUser = new User();
      testUser.id = nanoid(12);
      testUser.password = nanoid(12);

      const fetchOneStub = sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(bcryptjs, 'genSaltSync').onCall(0).returns(testSalt);
      sandbox.stub(bcryptjs, 'hashSync').onCall(0).returns(testUser.password);
      const updateStub = sandbox.stub(UserModel.prototype, 'update').onCall(0).resolves();

      await userService.updateUserById(testUser.id, { password: testUser.password });

      expect(fetchOneStub.calledOnce).to.be.equal(true);
      expect(updateStub.calledOnce).to.be.equal(true);
    });
  });

  describe('deleteUserById', (): void => {
    it('should delete a user from the database given user id', async (): Promise<void> => {
      const testUser = new User();
      testUser.id = nanoid(12);

      const fetchOneStub = sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      const deleteStub = sandbox.stub(UserModel.prototype, 'delete').onCall(0).resolves();

      await userService.deleteUserById(testUser.id);

      expect(fetchOneStub.calledOnce).to.be.equal(true);
      expect(deleteStub.calledOnce).to.be.equal(true);
    });
  });
};
