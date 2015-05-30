module.exports = {
  db: {
    host: process.env.REMP_MONGO_DB_HOST,
    port: 27017,
    database: "remp4_production",
    username: process.env.REMP_MONGO_DB_USER,
    password: process.env.REMP_MONGO_DB_PW,
    name: "db",
    connector: "mongodb"
  }
};

