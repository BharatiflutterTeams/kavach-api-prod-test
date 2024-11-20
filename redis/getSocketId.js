const { getRedisData } = require("./redisFunctions");
const { EMPLOYEE_SOCKET_KEY } = require("./redisKeys");

const getEmployeeSocketStatus = async (employeeId) => {
    let employeeSocketStatus = await getRedisData(EMPLOYEE_SOCKET_KEY);

    employeeSocketStatus = employeeSocketStatus || {};

    return employeeSocketStatus[employeeId];
};

module.exports = { getEmployeeSocketStatus };