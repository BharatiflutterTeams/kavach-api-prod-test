const { BrowserHistory } = require('../websocket/model/models');
const logger = require('../logger/index');
const employeeSockets = require('../websocket/index');  // Use destructuring to get the correct import

// Helper function for logging and responding
function logAndRespond(message, status, res, req, service, data = null) {
    logger.info(message, {
        metaData: {
            Path: req.path,
            Service: service,
            Method: req.method,
        },
    });
    return res.status(status).json({ message, data });
}

// ============================ GET INTERNET HISTORY ===========================
async function getInternetHistory(req, res) {
    const { employeeId } = req.params;
    console.log("<<EMP ID", req.params);

    try {
        // Check if the employee is connected via WebSocket
        const employeeSocket = employeeSockets[employeeId];

        if (employeeSocket) {
            // If WebSocket is connected, request the employee to fetch the internet history via socket
            employeeSocket.emit('fetchInternetHistory');

            // Log that the internet history is being fetched via WebSocket and respond
            return logAndRespond('Fetching Internet history via WebSocket.', 200, res, req, 'InternetHistory_service');
        } else {
            // If WebSocket is not connected, fetch the latest history from the database
            const history = await BrowserHistory.findOne({ employeeId }).sort({ downloadDate: -1 });

            if (!history) {
                return logAndRespond('No internet history found for this employee.', 404, res, req, 'InternetHistory_service');
            }

            // Log that internet history was fetched successfully and respond with it
            return logAndRespond('Internet history fetched successfully.', 200, res, req, 'InternetHistory_service', history);
        }
    } catch (error) {
        // Log any errors encountered during the fetching process
        logger.error('Error fetching Internet history.', {
            metaData: { Path: req.path, Service: 'InternetHistory_service', Method: req.method },
            error: error.message,
        });
        return logAndRespond('Server error. Unable to fetch internet history.', 500, res, req, 'InternetHistory_service');
    }
}

module.exports = {
    getInternetHistory,
};
