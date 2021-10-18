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

  async insert() {
    const data = await this.coinAPI.fetch();
    const documents = [];
    Object.entries(data.bpi).forEach((entry) => {
      documents.push({
        date: entry[0],
        value: entry[1],
      });
    });
    return this.collection.insertMany(documents);
  }

  async getMax() {
    return this.collection.findOne({}, { sort: { value: -1 } });
  }

  async max() {
    console.info("Connection to MongoDb");
    console.time("mongodb-connect");
    const client = await this.connect();
    console.info("Successfully connected to MongoDb");
    console.timeEnd("mongodb-connect");

    console.info("Insterting into MongoDb");
    console.time("mongodb-insert");
    const insertResult = await this.insert();
    console.timeEnd("mongodb-insert");

    console.info(
      `Inserted ${insertResult.insertedCount} documents into MongoDb`
    );

    console.info("Querying from MongoDb");
    console.time("mongodb-find");
    const maxVal = await this.getMax();
    console.timeEnd("mongodb-find");

    console.info("Disconnecting from MongoDb");
    console.time("mongodb-disconnect");
    await this.disconnect();
    console.timeEnd("mongodb-disconnect");

    return {
      date: maxVal.date,
      value: maxVal.value,
    };
  }
}

module.exports = MongoBackend;
