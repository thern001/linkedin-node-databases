const pkg = require("../../package.json");

module.exports = {
  applicationName: pkg.name,
  mongodb: {
    url: "mongodb://localhost:37017/shopper",
  },
  redis: {
    port: 7379,
    client: null,
  },
  mysql: {
    options: {
      dialect: "mysql",
      host: "localhost",
      port: 3406,
      database: "shopper",
      username: "root",
      password: "mypassword",
    },
    client: null,
  },
};
