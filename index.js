const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/agendamento", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("oi");
});

app.listen(8686, () => {
  console.log("Servidor rodando");
});
