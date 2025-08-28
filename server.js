// server.js
require('dotenv').config();   // <--- load .env first

const Ccc = require('./ccc');

const PORT = process.env.PORT || 3000;

const server = new Ccc(PORT);
server.start();
