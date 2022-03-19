const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");
const mailer = require("nodemailer");

const Appo = mongoose.model("Appointment", appointment);

class AppointmentService {
  async Create(name, email, description, cpf, date, time) {
    const newAppo = new Appo({
      name,
      email,
      description,
      cpf,
      date,
      time,
      finished: false,
      notified: false,
    });
    try {
      await newAppo.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async GetAll(showFinished = false) {
    try {
      if (showFinished) {
        return await Appo.find();
      } else {
        const appos = await Appo.find({ finished: false });
        const newAppos = [];
        appos.forEach((appo) => {
          if (appo.date) {
            newAppos.push(AppointmentFactory.Build(appo));
          }
        });
        return newAppos;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async GetById(id) {
    try {
      return await Appo.findOne({ _id: id });
    } catch (error) {
      console.log(error);
    }
  }
  async Finish(id) {
    try {
      await Appo.findByIdAndUpdate(id, { finished: true });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async Search(query) {
    try {
      return await Appo.find().or([{ email: query }, { cpf: query }]);
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async SandNotification() {
    try {
      const appos = await this.GetAll(false);
      const transporter = mailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "4d4dffdc8c5900",
          pass: "f89252eac510c9",
        },
      });
      appos.forEach(async (appo) => {
        const date = appo.start.getTime();
        const hour = 3600000;
        const gap = date - Date.now();

        if (gap <= hour) {
          if (!appo.notified) {
            await Appo.findByIdAndUpdate(appo.id, { notified: true });
            transporter
              .sendMail({
                from: "Emerson <emerson@gmail.com>",
                to: appo.email,
                subject: "Sua consulta pode ocorrer em breve!",
                text: "sssssss",
              })
              .then(() => {})
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new AppointmentService();
