/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const CoinAPI = require("../CoinAPI");
const Redis = require("ioredis");

class RedisBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.client = null;
  }

  async connect() {
    this.client = new Redis(7379);
    return this.client;
  }

  async disconnect() {
    return this.client.disconnect();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const values = [];
    Object.entries(data.bpi).forEach((entries) => {
      values.push(entries[1]);
      values.push(entries[0]);
    });
    return this.client.zadd("maxcoin:values", values);
  }

  async getMax() {
    return this.client.zrange("maxcoin:values", -1, -1, "WITHSCORES");
  }

  async max() {
    console.info("Connection to Redis");
    console.time("Redis-connect");
    const client = this.connect();
    if (client) {
      console.info("Successfully connected to Redis");
    } else {
      throw new Error("Connecting Failed");
    }
    console.info("Successfully connected to Redis");
    console.timeEnd("Redis-connect");

    console.info("Insterting into Redis");
    console.time("Redis-insert");
    const insertResult = await this.insert();
    console.timeEnd("Redis-insert");

    console.info(`Inserted ${insertResult} documents into Redis`);

    console.info("Querying from Redis");
    console.time("Redis-find");
    const result = await this.getMax();
    console.timeEnd("Redis-find");

    console.info("Disconnecting from Redis");
    console.time("Redis-disconnect");
    await this.disconnect();
    console.timeEnd("Redis-disconnect");
    return result;
  }
}

module.exports = RedisBackend;
