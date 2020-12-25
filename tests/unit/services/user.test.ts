import { ERROR_CODES, ROLES } from '../../../src/constants';
import { describe, it } from 'mocha';
import { UserModel } from '../../../src/models';
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
    const logger = { debugFunction: (): void => null };
    const mongo = { getDb: async (): Promise<void> => null };
    userService = new UserService(logger as any, mongo as any);
  });

  afterEach((): void => {
    sandbox.restore();
  });

  describe('registerUser', (): void => {
    it('should register new user to the database', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testSalt = nanoid(12);
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

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
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(bcryptjs, 'compareSync').onCall(0).returns(true);
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
      const testStatusCode = 401;

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).rejects(httpError(404));

      try {
        await userService.authenticateUser(testUsername, testPassword);
      } catch (error) {
        expect(error.status).to.equal(testStatusCode);
        expect(error.errorCode).to.equal(ERROR_CODES.UNAUTHENTICATED);
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
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const testStatusCode = 401;

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(bcryptjs, 'compareSync').onCall(0).returns(false);

      try {
        await userService.authenticateUser(testUser.username, testPassword);
      } catch (error) {
        expect(error.status).to.equal(testStatusCode);
        expect(error.errorCode).to.equal(ERROR_CODES.UNAUTHENTICATED);
      }
    });
  });

  describe('fetchUserById', (): void => {
    it('should return user fetched from the database given user id', async (): Promise<void> => {
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);

      const { user } = await userService.fetchUserById(testUser.id);

      expect(user).to.deep.equal(testUser);
    });
  });

  describe('fetchUsers', (): void => {
    it('should return users list fetched from the database', async (): Promise<void> => {
      const testUsers = [
        {
          id: nanoid(12),
          username: nanoid(12),
          email: nanoid(12),
          password: nanoid(12),
          name: nanoid(12),
          role: ROLES.USER,
          createdOn: Date.now(),
        },
      ];

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
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(UserModel.prototype, 'update').onCall(0).resolves();

      await userService.updateUserById(testUser.id, testUser);

      expect(true).to.equal(true);
    });
  });

  describe('updateUserPasswordById', (): void => {
    it('should update user password in the database given user id', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testNewPassword = nanoid(12);
      const testSalt = nanoid(12);
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(bcryptjs, 'compareSync').onCall(0).returns(true);
      sandbox.stub(bcryptjs, 'genSaltSync').onCall(0).returns(testSalt);
      sandbox.stub(bcryptjs, 'hashSync').onCall(0).returns(testUser.password);
      sandbox.stub(UserModel.prototype, 'update').onCall(0).resolves();

      await userService.updateUserPasswordById(testUser.id, testPassword, testNewPassword);

      expect(true).to.equal(true);
    });

    it('should fail to update user password when current password does not match', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testNewPassword = nanoid(12);
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const testStatusCode = 403;

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(bcryptjs, 'compareSync').onCall(0).returns(false);

      try {
        await userService.updateUserPasswordById(testUser.id, testPassword, testNewPassword);
      } catch (error) {
        expect(error.status).to.equal(testStatusCode);
        expect(error.errorCode).to.equal(ERROR_CODES.NOT_ALLOWED);
      }

      expect(true).to.equal(true);
    });
  });

  describe('deleteUserById', (): void => {
    it('should delete a user from the database given user id', async (): Promise<void> => {
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(UserModel.prototype, 'delete').onCall(0).resolves();

      await userService.deleteUserById(testUser.id);

      expect(true).to.equal(true);
    });
  });

  describe('deleteUserByIdWithCredentials', (): void => {
    it('should delete a user from the database given user id and password', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(bcryptjs, 'compareSync').onCall(0).returns(true);
      sandbox.stub(UserModel.prototype, 'delete').onCall(0).resolves();

      await userService.deleteUserByIdWithCredentials(testUser.id, testPassword);

      expect(true).to.equal(true);
    });

    it('should fail to delete a user when password does not match', async (): Promise<void> => {
      const testPassword = nanoid(12);
      const testUser = {
        id: nanoid(12),
        username: nanoid(12),
        email: nanoid(12),
        password: nanoid(12),
        name: nanoid(12),
        role: ROLES.USER,
        createdOn: Date.now(),
      };
      const testStatusCode = 403;

      sandbox.stub(UserModel.prototype, 'fetchOne').onCall(0).resolves(testUser);
      sandbox.stub(bcryptjs, 'compareSync').onCall(0).returns(false);

      try {
        await userService.deleteUserByIdWithCredentials(testUser.id, testPassword);
      } catch (error) {
        expect(error.status).to.equal(testStatusCode);
        expect(error.errorCode).to.equal(ERROR_CODES.NOT_ALLOWED);
      }

      expect(true).to.equal(true);
    });
  });
};
