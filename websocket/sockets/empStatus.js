module.exports = (socket, io, employeeSockets, logger, empLiveStatus) => {
  // Function to update employee status
  function updateEmpLiveStatus(employeeId, status) {
    // Update the status in the empLiveStatus object
    empLiveStatus[employeeId] = status;
    logger.info(`Employee ${employeeId} status updated to ${status}`);
  }

  // Handle receiving employee status updates
  socket.on("employeeStatus", (data) => {
    console.log(`Received employee status for employeeId ${data.employeeId}`);

    try {
      if (data.employeeId && data.status) {
        // Store status for the employee in empLiveStatus
        updateEmpLiveStatus(data.employeeId, data.status);

        // Emit updated status to all connected clients
        io.emit("sendEmployeeStatus", {
          employeeId: data.employeeId,
          status: data.status,
        });
        console.log("Sent employee status to all connected clients", {
          employeeId: data.employeeId,
          status: data.status,
        });
      } else {
        console.log("Invalid data received:", data);
      }
    } catch (error) {
      console.log("Error handling employee status:", error);
    }
  });

  // Handle client request for system status
  socket.on("system_status", (data) => {
    // console.log("Received system status request for employee", data);
    // Update employee's live status
    updateEmpLiveStatus(data.employeeId, data.status);
    console.info(`Updated EMP LIVE STATUS: ${empLiveStatus}`);

    try {
      // Emit the status update to all clients
      io.emit("sendEmployeeStatus", data);
      logger.info(
        "Sent EMP status to clients with WS >>>>",
        data,
        empLiveStatus
      );
    } catch (error) {
      logger.error("Error sending employee status to clients:", error);
    }
  });

  // Handle disconnect and update status
  // socket.on("disconnect", () => {
  //   Object.entries(employeeSockets).forEach(([employeeId, sock]) => {
  //     if (sock === socket) {
  //       updateEmpLiveStatus(employeeId, "inactive"); // Set status to inactive
  //       delete employeeSockets[employeeId]; // Remove from active sockets
  //       logger.info(`Employee ${employeeId} disconnected and set to inactive`);
  //     }
  //   });
  // });
};
