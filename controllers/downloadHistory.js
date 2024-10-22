const { DownloadHistory } = require('../websocket/model/models');
const { logAndRespond } = require('../utils/responseUtils'); // Importing the helper function
const employeeSockets = require('../websocket/index');
const logger = require("../logger/index");
// ========================= GET DOWNLOAD HISTORY ==========================
async function getDownloadHistory(req, res) {
    const { employeeId } = req.params;
    logger.info("Received request to fetch download history for employee ID.", {
        metaData: { Path: req.path, Service: 'DownloadHistory_service', Method: req.method, employeeId },
    });

    try {
        const employeeSocket = employeeSockets[employeeId];

        if (employeeSocket) {
            logger.info("Emitting fetchDownloadHistory via WebSocket.", {
                metaData: { Path: req.path, Service: 'DownloadHistory_service', Method: req.method },
            });

            employeeSocket.emit('fetchDownloadHistory');
            return logAndRespond('Fetching download history via WebSocket.', 200, res, req, 'DownloadHistory_service');
        } else {
            logger.info("Fetching download history from database as WebSocket not connected.", {
                metaData: { Path: req.path, Service: 'DownloadHistory_service', Method: req.method },
            });

            const history = await DownloadHistory.findOne({ employeeId }).sort({ downloadDate: -1 });

            if (!history) {
                return logAndRespond('No download history found for this employee.', 404, res, req, 'DownloadHistory_service');
            }

            return logAndRespond('Download history fetched successfully.', 200, res, req, 'DownloadHistory_service', history);
        }
    } catch (error) {
        logger.error('Error fetching download history.', {
            metaData: { Path: req.path, Service: 'DownloadHistory_service', Method: req.method },
            error: error.message,
        });
        return logAndRespond('Server error. Unable to fetch download history.', 500, res, req, 'DownloadHistory_service');
    }
}

module.exports = {
    getDownloadHistory,
};
