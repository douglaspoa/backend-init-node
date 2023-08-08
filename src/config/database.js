// ./src/config/database.js
require('dotenv').config();
const mongoose = require('mongoose');

const server = process.env.MONGO_INITDB_SERVER;
const username = process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const database = process.env.MONGO_INITDB_DATABASE;
const port = process.env.MONGO_INITDB_PORT;
const authSource = process.env.MONGO_INITDB_AUTHSOURCE;

const connectionString = `mongodb://${username}:${password}@${server}:${port}/${database}?authSource=${authSource}`;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));