const path = require('path');
function decideEnv() {
  const { NODE_ENV } = process.env;
  // this function decides whether to load .env or .env.test.
  if (NODE_ENV != 'production') {
    // capture first command line argument passed to this script

    const args = process.argv[2];

    const envFile = args === 'test' ? '../.env.test' : '../.env';

    require('dotenv').config({
      path: path.join(__dirname, envFile),
    });
  }
}
module.exports = { decideEnv };
