const { get } = require("mongoose");
const { EMPLOYEE_STATUSES_KEY } = require("../../redis/redisKeys");
const { getRedisData, setRedisData } = require("../../redis/redisFunctions");

module.exports = (socket, io, employeeSockets, logger, empLiveStatus) => {
  // Function to update employee status
  function updateEmpLiveStatus(employeeId, status) {
    // Update the status in the empLiveStatus object
    empLiveStatus[employeeId] = status;
    logger.info(`Employee ${employeeId} status updated to ${status}`);
  }

  // Handle receiving employee status updates
  socket.on("employeeStatus", async (data) => {
    console.log(`Received employee status for employeeId ${data.employeeId}`);

    try {
      if (data.employeeId && data.status) {
        // Store status for the employee in empLiveStatus
        updateEmpLiveStatus(data.employeeId, data.status);

        // Emit updated status to all connected clients

        console.log("Sent employee status to all connected clients", {
          employeeId: data.employeeId,
          status: data.status,
        });

        // Step 1: Get existing employee statuses from Redis
        let employeeStatuses = await getRedisData(EMPLOYEE_STATUSES_KEY);
        employeeStatuses = employeeStatuses ? employeeStatuses : {};

        console.log("fetching from the REDIS", employeeStatuses);

        if (
          Boolean(employeeStatuses[data?.employeeId]) &&
          employeeStatuses[data?.employeeId] === data.status
        ) {
          // do not emit if the status is the same
          // io.emit("sendEmployeeStatus", {
          //   employeeId: data.employeeId,
          //   status: data.status,
          // });
          console.log("Status is the same, not emitting to clients");
        } else {
          console.log("DIFFRENT STATUS");

          io.emit("sendEmployeeStatus", {
            employeeId: data.employeeId,
            status: data.status,
          });

          logger.info(
            `SENT EMP STATUS TO CLIENT >> {employeeId: ${data.employeeId}, empStatus: ${data.status}}`
          );

          // Step 2: Update the status for this particular employeeId
          employeeStatuses[data?.employeeId] = data.status;

          // Step 3: Store the updated statuses back in Redis
          await setRedisData(EMPLOYEE_STATUSES_KEY, employeeStatuses);
          logger.info(`Updated Redis cache for employeeId ${data.employeeId}`);
        }
      } else {
        console.log("Invalid data received:", data);
      }
    } catch (error) {
      console.log("Error handling employee status:", error);
      logger.error("Error handling employee status:", error);
    }
  });

  // Handle client request for system status
  socket.on("system_status", async (data) => {
    // console.log("Received system status request for employee", data);
    // Update employee's live status
    // updateEmpLiveStatus(data.employeeId, data.status);
    console.info(`Updated EMP LIVE STATUS: ${empLiveStatus}`);

    try {
      if (data.employeeId && data.status) {
        // Store status for the employee in empLiveStatus
        updateEmpLiveStatus(data.employeeId, data.status);

        // Emit updated status to all connected clients

        // Step 1: Get existing employee statuses from Redis
        let employeeStatuses = await getRedisData(EMPLOYEE_STATUSES_KEY);
        employeeStatuses = employeeStatuses ? employeeStatuses : {};

        if (
          Boolean(employeeStatuses[data?.employeeId]) &&
          employeeStatuses[data?.employeeId] === data.status
        ) {
          // do not emit if the status is the same
          io.emit("sendEmployeeStatus", data);
          logger.info(
            "Sent EMP status to clients with WS >>>>",
            data,
            empLiveStatus
          );
          console.log("Sent employee status to all connected clients", {
            employeeId: data.employeeId,
            status: data.status,
          });
          console.log("Status is the same, not emitting to clients");
        } else {
          io.emit("sendEmployeeStatus", data);
          logger.info(
            "Sent EMP status to clients with WS >>>>",
            data,
            empLiveStatus
          );
          console.log("Sent employee status to all connected clients", {
            employeeId: data.employeeId,
            status: data.status,
          });

          // Step 2: Update the status for this particular employeeId
          employeeStatuses[data?.employeeId] = data.status;

          // Step 3: Store the updated statuses back in Redis
          await setRedisData(EMPLOYEE_STATUSES_KEY, employeeStatuses);
          console.log(`Updated Redis cache for employeeId ${data.employeeId}`);
        }
      }

      // Emit the status update to all clients
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
