module.exports = (socket, io, employeeSockets, logger) => {
    // Listen for employee ID and associate the socket with the employee
    socket.on('EMPLOYEE_ID', (employeeId) => {
      employeeSockets[employeeId] = socket; 
      logger.info(`Received EMPLOYEE_ID: ${employeeId}`);
    });
    // Handle request to fetch key logs for a specific employee
    socket.on('get_key_logs', async (employeeId) => {
      const employeeSocket = employeeSockets[employeeId];
      if (employeeSocket) {
        logger.info(`Requesting key logs for Employee ID: ${employeeId}`);
  
        // Emit a request to the Python client for key logs
        employeeSocket.emit('request_key_logs', { employeeId });
        console.log("Emitted");
        
  
        // Listen for the key logs response from Python
        employeeSocket.once('key_logs_response', async (keyLogs) => {
          
          logger.info(`Received key logs for Employee ID: ${employeeId}`);
  
  
          // Send the key logs back to the requesting client (dashboard)
          if (keyLogs && keyLogs.data) {
            try {
                const parsedLogs = JSON.parse(keyLogs.data);
                console.log("<<<<",parsedLogs);
                 // Parse the JSON data from Python
                logger.info(`Parsed key logs: ${parsedLogs.length} entries`);

                // Send the parsed key logs back to the requesting client (dashboard)
                socket.emit('key_logs', { employeeId, keyLogs: parsedLogs });
                console.log(`Emitted parsed key logs to client for Employee ID: ${employeeId}`);
            } catch (error) {
                logger.error(`Failed to parse key logs for Employee ID: ${employeeId} - ${error.message}`);
                socket.emit('key_logs', { employeeId, keyLogs: [] });
            }
        } else {
            logger.warn(`No key logs found for Employee ID: ${employeeId}`);
            socket.emit('key_logs', { employeeId, keyLogs: [] });
        }
    });
} else {
    logger.error(`Employee ${employeeId} is not connected.`);
    socket.emit('error', 'Employee not connected');
}
});
};