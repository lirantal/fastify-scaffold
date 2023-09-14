import knex from "knex";

class DatabaseManager {
  constructor(config) {
    this.dbConfig = {
      client: "pg",
      connection: {
        connectionString: config.DATABASE_URL,
        host: config["DB_HOST"],
        port: config["DB_PORT"],
        user: config["DB_USER"],
        database: config["DB_NAME"],
        password: config["DB_PASSWORD"],
        ssl: config["DB_SSL"] ? { rejectUnauthorized: false } : false,
      },
    };

    this.db = knex(this.dbConfig);
  }

  connection() {
    return this.db;
  }

  ping() {
    return this.db.raw("SELECT 1+1 AS RESULT");
  }

  close() {
    return this.db.destroy();
  }
}

export { DatabaseManager };
