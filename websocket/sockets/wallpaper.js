const { WallpaperChangeLog } = require("../model/models");

module.exports = (socket, io, employeeSockets, logger) => {
  socket.on("trigger_change_wallpaper", (data) => {
    logger.info("Received wallpaper change request:", data);

    const { employeeId, imageUrl } = data;

    const employeeSocket = employeeSockets[employeeId];

    if (employeeSocket) {
      logger.info(
        `Triggering wallpaper change for Employee: ${employeeId} ${imageUrl}`
      );

      employeeSocket.emit("change_wallpaper", imageUrl);

      logger.info("Wallpaper change event emitted to:", employeeId);
    } else {
      socket.emit("error", "Employee not connected");
    }
  });
};
