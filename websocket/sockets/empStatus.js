module.exports = (socket, io, employeeSockets, logger, empLiveStatus) => {
  function updateEmpLiveStatus(employeeId, status) {
    // Find the employee in the array
    const existingEmployee = empLiveStatus.find(
      (emp) => emp.employeeId === employeeId
    );

    
    if (existingEmployee) {
      // If employee is found, update the status
      existingEmployee.status = status;
    } else {
      // If not found, push a new employee status
      empLiveStatus.push({ employeeId, status });
    }
  }

  socket.on("employeeStatus", (data) => {
    console.log(`Received employee status for employeeId ${data.employeeId}`);

    try {
      if (data.employeeId && data.status) {
        // Store only the status as a string
        employeeSockets[data.employeeId] = data.status;

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

  // Handle client request for status
  socket.on("system_status", (data) => {
    // empLiveStatus.push({ employeeId: 'DESKTOP-4KFM6A4', status: 'idle' });
    updateEmpLiveStatus(data.employeeId, data.status);

    console.log("EMP LIVE STATUS >>> ", empLiveStatus);
    try {
      // const allEmployeeStatus = getAllEmpStatus(employeeSockets);
      io.emit("sendEmployeeStatus", data);
      logger.info("Sent employee status to client", data);
    } catch (error) {
      logger.error("Error sending employee status to client:", error);
    }
  });

  // function getAllEmpStatus(employeeSockets) {
  //     const allEmployeeStatus = {};

  //     for (const employeeId of Object.keys(employeeSockets)) {
  //         allEmployeeStatus[employeeId] = {
  //             status: employeeSockets[employeeId] || 'Unknown',
  //         };
  //     }
  //     console.log("allEmployeeStatus", allEmployeeStatus);

  //     return allEmployeeStatus;
  // }
};
