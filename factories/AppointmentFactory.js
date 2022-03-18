class AppointmentFactory {
  Build(simpleAppointment) {
    const day = simpleAppointment.date.getDate() + 1;
    const month = simpleAppointment.date.getMonth();
    const year = simpleAppointment.date.getFullYear();
    const hour = parseInt(simpleAppointment.time.split(":")[0]);
    const minutes = parseInt(simpleAppointment.time.split(":")[1]);
    const startData = new Date(year, month, day, hour, minutes, 0, 0, 0);

    const appo = {
      id: simpleAppointment._id,
      title: simpleAppointment.name + " - " + simpleAppointment.description,
      start: startData,
      end: startData,
    };
    return appo;
  }
}

module.exports = new AppointmentFactory();
