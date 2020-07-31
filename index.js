const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require("dotenv").config();
const config = require("./config");
const app = express();
const api = require("./api");

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream}));
app.use("/api", api);

mongoose.connect('mongodb+srv://userdb1:userdb1@cluster-twitter.rwbcf.mongodb.net/cluster-twitter?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=>{
    console.log("Conectado a la base de datos");
});

const server = app.listen(
  process.env.PORT || config.server.port,
  config.server.host,
  () => {
    console.log(
      `Servidor iniciado en el puerto ${server.address().port} en modo ${
        config.env
      }`
    );
  }
);
module.exports=server;