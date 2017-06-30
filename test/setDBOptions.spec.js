const { Connection, db } = require('../lib/index2');
const {
  seedDatabase,
  dropDatabase,
  generateDatabaseName,
  generateRandomString,
} = require('./setup-database');

describe('db.setOptions()', () => {
  const database = generateDatabaseName();
  let conn;

  beforeAll(seedDatabase(database));
  afterAll(dropDatabase(database));

  beforeEach(() => {
    conn = new Connection({
      //endpoint: 'http://localhost:61941/',
      endpoint: 'http://localhost:5820/',
      username: 'admin',
      password: 'admin',
    });
  });

  it('should get NOT_FOUND status code trying to set the options of a non-existent DB.', () => {
    return db
      .setOptions(conn, 'nodeDB_test', {
        query: {
          all: {
            graphs: true,
          },
        },
        transaction: {
          logging: true,
        },
      })
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });

  it('should set the options of an DB', () => {
    return db
      .offline(conn, database)
      .then(() => {
        return db.setOptions(conn, database, {
          query: {
            all: {
              graphs: true,
            },
          },
          transaction: {
            logging: true,
          },
        });
      })
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
});
