const isValidDateString = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isValidTime = (value) => {
    if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
        return false;
    }
    return true;
};

const timeToMinutes = (value) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
};

const minutesToTime = (value) => {
    const hours = String(Math.floor(value / 60)).padStart(2, "0");
    const minutes = String(value % 60).padStart(2, "0");
    return `${hours}:${minutes}`;
};

const getDayName = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "UTC"
    });
};

const isInPast = (dateString, timeString) => {
    const requested = new Date(`${dateString}T${timeString}:00`);
    return requested.getTime() <= Date.now();
};

module.exports = {
    isValidDateString,
    isValidTime,
    timeToMinutes,
    minutesToTime,
    getDayName,
    isInPast
};
