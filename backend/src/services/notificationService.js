const Notification = require("../models/Notification");

const createNotification = async ({ user, title, message, type = "system", relatedAppointment = null }) => {
    return Notification.create({
        user,
        title,
        message,
        type,
        relatedAppointment
    });
};

module.exports = { createNotification };
