const { ScreenshotHistory } = require('../model/models');
const logger = require('../../logger/index');

module.exports = (socket, io, employeeSockets) => {
  
  // Handle email settings sent to the WebSocket
  socket.on('sendEmailSettings', (data) => {

    const { employeeId, senderEmail, receiverEmail, ccEmail, password, screenshotInterval, screenshotDays,date,startTime,endTime } = data;
    logger.info(`Received email settings for Employee ID: ${employeeId} >> ${JSON.stringify(data)}`);

    const employeeSocket = employeeSockets[employeeId];
    
    if (employeeSocket) {
      logger.info(`Emitting email settings to Employee ID: ${employeeId}`);
      employeeSocket.emit('processEmailSettings', data);
    } else {
      logger.warn(`Employee socket not found for Employee ID: ${employeeId}`);
    }
    logger.debug(`Email settings: ${JSON.stringify(data)}`);
  });

  // Handle screenshot request from the client
  socket.on('takeScreenshot', (data) => {
    const { employeeId, senderEmail, receiverEmail, ccEmail, password } = data;

    const employeeSocket = employeeSockets[employeeId];
    const logDetails = `Sender: ${senderEmail}, Receiver: ${receiverEmail}, CC: ${ccEmail}`;

    if (employeeSocket) {
      logger.info(`Requesting screenshot for Employee ID: ${employeeId}`);
      logger.debug(`Screenshot request details: ${logDetails}`);
      employeeSocket.emit('processScreenshotRequest', { employeeId, senderEmail, receiverEmail, ccEmail, password });
    } else {
      logger.warn(`Employee socket not connected for Employee ID: ${employeeId}`);
      socket.emit('error', 'Employee not connected');
    }
  });

  // Handle the screenshot response from Python
  socket.on('screenshotData', async (data) => {
    if (data && data.screenshot && data.employeeId) {
      const formattedData = {
        employeeId: data.employeeId,
        screenshot: data.screenshot,
        timestamp: new Date(),
        emailDetails: {
          senderEmail: data.senderEmail,
          receiverEmail: data.receiverEmail,
          ccEmail: data.ccEmail,
          password: data.password,
        },
      };

      logger.info(`Received and processing screenshot data for Employee ID: ${data.employeeId}`);
      io.emit('sendScreenshotData', formattedData);
    } else {
      logger.error('Invalid screenshot data received from Python');
    }
  });
};
