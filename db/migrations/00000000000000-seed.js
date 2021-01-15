module.exports = {
  async up(db) {
    await db
      .collection('users')
      .createIndex({ id: 1 }, { unique: true });
    await db
      .collection('users')
      .createIndex({ username: 1 }, { unique: true });
    await db
      .collection('users')
      .createIndex({ email: 1 }, { unique: true });
    await db
      .collection('users')
      .createIndex({ createdOn: 1 });
    await db
      .collection('users')
      .insertMany([
        {
          id: 'aaaaaaaaaaaa',
          username: 'admin',
          email: 'admin@example.com',
          password: '$2a$12$mKfWXLjhcswHNqAa8mTchO2ouzAUZcaD.579.4z/undGVV4WG.lNu', // PLAIN TEXT: password
          name: 'Admin',
          role: 'admin',
          modifiedOn: 0,
          createdOn: Date.now(),
        },
        {
          id: 'bbbbbbbbbbbb',
          username: 'user',
          email: 'user@example.com',
          password: '$2a$12$mKfWXLjhcswHNqAa8mTchO2ouzAUZcaD.579.4z/undGVV4WG.lNu', // PLAIN TEXT: password
          name: 'User',
          role: 'user',
          modifiedOn: 0,
          createdOn: Date.now(),
        }
      ]);
    await db
      .collection('notes')
      .createIndex({ id: 1 }, { unique: true });
    await db
      .collection('notes')
      .createIndex({ userId: 1 });
    await db
      .collection('notes')
      .createIndex({ createdOn: 1 });
  },

  async down(db) {
    await db.dropDatabase();
  }
};
