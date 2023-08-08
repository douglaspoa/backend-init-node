// app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser")
dotenv.config(); // carrega as variáveis de ambiente
const userRoutes = require('./routes/userRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const roleRoutes = require('./routes/roleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const middlewareAuthentication = require('./middlewares/authentication');
const port = process.env.APP_PORT


require('./config/database'); // conecta com o banco de dados

const swaggerDocument = require('../public/swagger.json'); // documentação da API

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}));
app.use(cookieParser());
app.use(express.json()); // responsavel por fazer o parse do body da requisição para JSON
app.use('/authentication', authenticationRoutes);
app.use(async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN)
    try {
        middlewareAuthentication(req, res, next);
        next();
    } catch (error) {
       res.status(401).send(error.message);
    }
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/categories', categoryRoutes);
app.listen(port, () => {
    console.log('Server running on port ', port);
});
module.exports = app;
