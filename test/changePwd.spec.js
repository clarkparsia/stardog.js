const { Connection, user, db } = require('../lib/index2');
const { generateRandomString, ConnectionFactory } = require('./setup-database');

describe('changePwd()', () => {
  let conn;

  beforeEach(() => {
    conn = ConnectionFactory();
  });

  it('should fail trying to change a password (char[]) from an non-existent user', () => {
    return user.changePassword(conn, 'someuser', 'passworddd').then(res => {
      expect(res.status).toEqual(404);
    });
  });

  it('should change the password and allow calls with new credentials', () => {
    const username = generateRandomString();
    const password = generateRandomString();
    const newPassword = generateRandomString();
    return user
      .create(conn, {
        username,
        password,
        superuser: true,
      })
      .then(res => {
        expect(res.status).toEqual(201);
        return user.changePassword(conn, username, newPassword);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        // Switch to new user
        conn.config({
          username,
          password: newPassword,
        });
        return db.list(conn);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.result.databases.length).toBeGreaterThan(0);
      });
  });
});
