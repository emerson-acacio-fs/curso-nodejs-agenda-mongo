class AppointmentFactory {
  Build({ date, time, _id, name, description, notified, email }) {
    const day = date.getDate() + 1;
    const month = date.getMonth();
    const year = date.getFullYear();
    const hour = parseInt(time.split(":")[0]);
    const minutes = parseInt(time.split(":")[1]);
    console.log(
      `${email} - ${day}/${month}/${year} - ${hour}:${minutes} notified: ${notified}`
    );
    const startData = new Date(year, month, day, hour, minutes, 0, 0, 0);

    const appo = {
      id: _id,
      title: name + " - " + description,
      start: startData,
      end: startData,
      notified,
      email,
    };
    return appo;
  }
}

module.exports = new AppointmentFactory();
