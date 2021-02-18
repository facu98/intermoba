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
  Transaction.findOne({
    where: { cvu_receiver: req.params.cvu, status: "processing" },
  }).then((tr) => {
    if (!tr) {
      return res.send("empty");
    }
    res.send(tr)
  });
});

server.post("/", (req, res) => {
  const {
    amount,
    cvu_sender,
    cvu_receiver,
    name_sender,
    description,
  } = req.body;
  if (!amount || !cvu_sender || !cvu_receiver) {
    return res.status(400).send("Missing parameters");
  }

  if (typeof parseInt(amount) !== "number" || parseInt(amount) < 0) {
    return res.status(400).send("Invalid amount");
  }
  Transaction.create(req.body).then((tr) => {
    res.send(tr);
  });




  server.post("/changestatus", (req, res) => {
    const { cvu, status, id, message, user } = req.body;
    Transaction.findOne({
      where:{id}
    })
    .then((tr) => {
      if(status === 'cancelled'){
        tr.status = 'cancelled'
        tr.message = message
        tr.save().then((tr) => {return res.send(tr)})
      }
      else{
        tr.user = user
        tr.status = 'confirmed'
        tr.save().then((tr) => {return res.send(tr)})
      }
    })
  });

  server.get('/checkstatus/:id', (req,res) => {
    Transaction.findOne({
      where:{id:req.params.id}
    })
    .then((tr) => {
      console.log(tr)
      if(!tr){return res.send('Transaction not found')}
      res.send(tr)
    })
  })
});
module.exports = server;
