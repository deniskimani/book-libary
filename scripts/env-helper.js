const path = require("path");
function loadEnv() {
  const { NODE_ENV } = process.env;
  // this function decides whether to load .env or .env.test.
  if (NODE_ENV != "production") {
    // capture first command line argument passed to this script

    const args = process.argv[2];

    const envFile = args === "test" ? "../.env.test" : "../.env";

    require("dotenv").config({
      path: path.join(__dirname, envFile),
    });
  }
  const databaseName = process.env.PGDATABASE;

  // remove the name of the database from the environment, so pg doesn't try to connect to a db which doesn't exist yet
  delete process.env.PGDATABASE;

  return databaseName;
}
module.exports = { loadEnv };
