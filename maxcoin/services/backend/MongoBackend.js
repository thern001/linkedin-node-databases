/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

const { MongoClient } = require("mongodb");

const CoinAPI = require("../CoinAPI");

class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.mongoUrl = "mongodb://localhost:37017/maxcoin";
    this.client = null;
    this.collection = null;
  }

  async connect() {
    const mongoClient = new MongoClient(this.mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    try {
      this.client = await mongoClient.connect();
      this.collection = this.client.db("maxcoin").collection("values");
      return this.client;
    } catch (error) {
      console.log("ERROR aquiring DB Connection!");
      console.log(error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      return this.client.close();
    }
    return false;
  }

  async insert() {}

  async getMax() {}

  async max() {
    console.info("Connection to MongoDb");
    console.time("mongodb-connect");
    const client = await this.connect();
    console.info("Successfully connected to MongoDb");
    console.timeEnd("mongodb-connect");

    console.info("Disconnecting from MongoDb");
    console.time("mongodb-disconnect");
    await this.disconnect();
    console.timeEnd("mongodb-disconnect");
  }
}

module.exports = MongoBackend;
