const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appointmentService = require("./services/AppointmentService");

mongoose.connect("mongodb://localhost:27017/agendamento", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.set("useFindAndModify", false);

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/cadastro", (req, res) => {
  res.render("create");
});

app.get("/list", async (req, res) => {
  const appos = await appointmentService.GetAll(true);
  res.render("list", { appos });
});

app.get("/searchresults", async (req, res) => {
  const appos = await appointmentService.Search(req.query.search);
  res.render("list", { appos });
});

app.get("/getcalendar", async (req, res) => {
  const appointments = await appointmentService.GetAll();
  res.json(appointments);
});
app.get("/event/:id", async (req, res) => {
  const { id } = req.params;
  const appointment = await appointmentService.GetById(id);

  res.render("event", { appo: appointment });
});

app.post("/finish", async (req, res) => {
  const { id } = req.body;
  if (await appointmentService.Finish(id)) {
    res.redirect("/");
  } else {
    res.status(500);
    res.send("Ocorreu uma falha");
  }
});

app.post("/create", async (req, res) => {
  const { name, email, description, cpf, date, time } = req.body;
  const status = await appointmentService.Create(
    name,
    email,
    description,
    cpf,
    date,
    time
  );

  if (status) {
    // res.status(200);
    // res.send("Ok");
    res.redirect("/");
  } else {
    res.status(500);
    res.send("Ocorreu uma falha");
  }
});

const pollTime = 5 * 6000 * 5;
setInterval(async () => {
  await appointmentService.SandNotification();
}, pollTime);

app.listen(8686, () => {
  console.log("Servidor rodando");
});
