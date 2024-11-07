module.exports = (io, employeeId, empStatus, logger) => {
  try {
    // Emit the status update to all clients
    io.emit("sendEmployeeStatus", {
      employeeId: employeeId,
      status: empStatus,
      timestamp: Date.now(),
    });
    logger.info(
      `SENT EMP STATUS TO CLIENT ON REGISTER WS >> {employeeId: ${employeeId}, empStatus: ${empStatus}}`
    );
  } catch (error) {
    logger.error("Error sending employee status to clients:", error);
  }
};
