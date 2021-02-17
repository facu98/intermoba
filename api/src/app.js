const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { Transaction } = require("./db");
require("./db.js");

const server = express();
const cors = require("cors");

server.name = "API";

server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

/////////////// ROUTES
server.get("/:cvu", (req, res) => {
  var transaction;
  Transaction.findOne({
    where: { cvu_receiver: req.params.cvu },
  }).then((tr) => {
    if(!tr){return res.send('empty')}
    transaction = tr;
    tr.destroy().then(() => {
      res.send(transaction);
    });
  });
});

server.post("/", (req, res) => {
  Transaction.create(req.body).then((tr) => {
    res.send(tr);
  });
});
module.exports = server;
