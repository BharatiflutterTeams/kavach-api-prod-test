    // utils/responseUtils.js
const logger = require('../logger/index');

// Helper function for logging and responding
function logAndRespond(message, status, res, req, service, data = null) {
    logger.info(message, {
        metaData: {
            path: req.path,
            service,
            method: req.method,
        },
    });
    return res.status(status).json({ message, data });
}

module.exports = {
    logAndRespond,
};
