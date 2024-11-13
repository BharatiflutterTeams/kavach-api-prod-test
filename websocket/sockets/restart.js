module.exports = (socket, io, employeeSockets, logger) => {
  // console.log("employeesockets: >>> ", employeeSockets);
  socket.on("restart", (data) => {
    console.log("<<<Received data from client", data);
    logger.info("Received data from client", data);

    const { employeeId, enabled, dayInterval, time } = data;

    console.log("Received restart settings : ", {
      employeeId,
      enabled,
      dayInterval,
      time,
    });
    logger.info("Received restart settings : ", {
      employeeId,
      enabled,
      dayInterval,
      time,
    });

    const employeeSocket = employeeSockets[employeeId];
    // console.log("employee socket:>> ", employeeSocket);
    console.log("Requesting restart status for Employee ID >:", employeeId);
    logger.info("Requesting restart status for Employee ID >>:", employeeId);
    employeeSocket.emit("intervalRestart", data);

    if (employeeSocket) {
      logger.info(`Requesting restart status for Employee: ${employeeId}`);
      //fetch data from python
      // socket.on('receive_config'){

      // }
      employeeSocket.emit("intervalRestart", data);
      console.log("Emitted data", { ...data, employeeId });
      logger.info("Emitted data", { ...data, employeeId });
    } else {
      socket.emit("error", "Employee not connected");
    }
  });
  socket.on("AllsettingsUpdated", ({ employeeId }) => {
    const employeeSocket = employeeSockets[employeeId];
    // const authorizedUser = emailSettings.authorizedUser;
    console.log("<<<empid is", employeeId);

    if (employeeSocket) {
      console.log("Emitting");

      employeeSocket.emit("settingsUpdated", employeeId);
    }
    console.log(`Received  settings for Employee ID: ${employeeId}`);
    logger.info(`Received  settings for Employee ID: ${employeeId}`);
  });
}; //working restart
