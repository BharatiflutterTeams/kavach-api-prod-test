const { Records } = require("../model/models");

module.exports = (socket, io, employeeSockets, logger) => {
  socket.on("sendRecords", (data, callback) => {
    logger.info("Received records from frontend:", data);

    if (data && data.receiverEmail && data.time) {
      const { receiverEmail, time, employeeId } = data;

      logger.info(
        `Receiver Email: ${receiverEmail}, Time: ${time}, Employee ID: ${employeeId}`
      );

      callback({
        status: "success",
        message: "Record data received successfully!",
        data: { receiverEmail, time },
      });

      const employeeSocket = employeeSockets[employeeId];

      if (employeeSocket) {
        logger.info(`Emitting startRecording to Employee: ${employeeId}`);
        employeeSocket.emit("startRecording", {
          message: "Start recording initiated.",
          data: { receiverEmail, time },
        });

        logger.info("Emitted startRecording data", { receiverEmail, time });
      } else {
        logger.error(`Employee not connected: ${employeeId}`);
        socket.emit("error", "Employee not connected");
      }
    } else {
      logger.error("Invalid record data received");

      callback({
        status: "error",
        message: "Invalid record data.",
      });
    }
  });
};
