const { Client } = require("pg");
const { decideEnv, loadEnv } = require("./env-helper");

const dropDatabase = async (databaseName) => {
  const client = new Client();
  try {
    await client.connect();

    console.log(`Destroying ${databaseName} database...`);

    await client.query(`DROP DATABASE ${databaseName} WITH (FORCE)`);

    console.log("Database destroyed!");
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
};

const databaseName = loadEnv();
dropDatabase(databaseName);
