const { BrowserHistory } = require("../model/models");

// internetHistory.js
module.exports = (socket, io, employeeSockets, logger) => {
    socket.on('getBrowserHistory', (employeeId) => {
      const employeeSocket = employeeSockets[employeeId];
  
      if (employeeSocket) {
        logger.info(`Requesting browser history for Employee: ${employeeId}`);
        employeeSocket.emit('fetchBrowserHistory');
      } else {
        socket.emit('error', 'Employee not connected');
      }
    });
  
    socket.on('browserHistory', async (data) => {
      logger.info('Received browser history from Python executable:', data);
  
      if (data && data.data && data.employeeId) {
        const formattedData = {
          data: {
            Chrome: data.data.Chrome || [],
            Firefox: data.data.Firefox || [],
            Edge: data.data.Edge || []
          },
          employeeId: data.employeeId
        };
        logger.info('Formatted browser history data:', formattedData);
       

        try {
          const newInternetHistory = new BrowserHistory ({
            employeeId : data.employeeId,
            data: {
              Chrome: data.data.Chrome || [],
              Firefox: data.data.Firefox || [],
              Edge: data.data.Edge || []
            },
            historyDate : new Date()
          });
          await newInternetHistory.save();
          logger.info('Browser history saved successfully');

          
        } catch (error) {
          logger.error('failed to save browser history',error);
          
        }
        io.emit('sendBrowserHistory', formattedData);
      } else {
        logger.error('Invalid browser history data received');
      }
    });
  };
  