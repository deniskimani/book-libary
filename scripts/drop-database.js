const { Client } = require('pg');
const { decideEnv } = require('./env-helper');

const loadEnv = () => {
  decideEnv();

  const databaseName = process.env.PGDATABASE;

  delete process.env.PGDATABASE;

  return databaseName;
};

const dropDatabase = async (databaseName) => {
  const client = new Client();
  try {
    await client.connect();

    console.log(`Destroying ${databaseName} database...`);

    await client.query(`DROP DATABASE ${databaseName} WITH (FORCE)`);

    console.log('Database destroyed!');
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
};

const databaseName = loadEnv();
dropDatabase(databaseName);
