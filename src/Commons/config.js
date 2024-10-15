const dotenv = require("dotenv");
const path = require("path");

if (process.env.NODE_ENV === "test") {
  dotenv.config({
    path: path.resolve(process.cwd(), ".test.env"),
  });
} else {
  dotenv.config();
}

const config = {
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  jwt: {
    accessTokenKeys: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKeys: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },
};

module.exports = config;
