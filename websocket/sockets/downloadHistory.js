const { getEmployeeSocketStatus } = require("../../redis/getSocketId");
const { getRedisData } = require("../../redis/redisFunctions");
const { EMPLOYEE_SOCKET_KEY } = require("../../redis/redisKeys");
const { DownloadHistory } = require("../model/models");
module.exports = (socket, io, employeeSockets, logger) => {
  socket.on("getDownloadHistory", async(employeeId) => {
    // console.log("employee socket from download history before selcting:", employeeSockets);
    const employeeSocket = employeeSockets[employeeId];
    // let employeeSocketStatus = await getRedisData(EMPLOYEE_SOCKET_KEY);
    // employeeSocketStatus = employeeSocketStatus ? employeeSocketStatus : {};
 
    // let employeeSocketRedis = employeeSocketStatus[employeeId];
   const employeeSocketRedis =await getEmployeeSocketStatus(employeeId);
    console.log("Requesting download history for Employee ID:", employeeId, employeeSocketRedis);
    // console.log("employee socket from download history:", employeeSocket); 
    
    // console.log("employee socket from download history after selcting:", employeeSocketRedis);
if (employeeSocketRedis) {
    const es = io.sockets.sockets.get(employeeSocketRedis);
    if (es) {
        es.emit("fetchDownloadHistory");
        logger.info(`Event emitted to Employee ${employeeId}`);
    } 

}

    // if (employeeSocket) {
    //   logger.info(`Requesting download history for Employee:  ${employeeId} to python agent`);
    //   //fetch data from python
    //   employeeSocket.emit("fetchDownloadHistory");
    // } else {
    //   socket.emit("error", "Employee not connected");
    // }
  });

  socket.on("downloadHistory", async (data) => {
    logger.info(`Received download history from Agent >>${data.employeeId}`);

    if (data && data.data && data.employeeId) {
      const formattedData = {
        data: {
          Chrome: data.data.Chrome || [],
          Firefox: data.data.Firefox || [],
          Edge: data.data.Edge || [],
        },
        employeeId: data.employeeId,
      };
      logger.info(`Sending data to Dashboard >> ${formattedData.employeeId}`);
      try {
        const newDownloadHistory = new DownloadHistory({
          employeeId: data.employeeId,
          downloads: formattedData.data,
          downloadDate: new Date(),
        });
        await newDownloadHistory.save();
        logger.info("Download history saved successfully!");
      } catch (error) {
        logger.error("Failed to save download history", error);
      }
      io.emit("sendDownloadHistory", formattedData);
    } else {
      logger.error("Invalid download history data received");
    }
  });
};
