const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");

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
}
module.exports = new AppointmentService();
