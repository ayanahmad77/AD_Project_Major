const Provider = require("../models/Provider");
const Appointment = require("../models/Appointment");
const { getDayName, timeToMinutes, minutesToTime, isValidDateString, isValidTime, isInPast } = require("../utils/date");

const getAvailableSlots = async (providerId, date) => {
    if (!isValidDateString(date)) {
        const error = new Error("Date must be in YYYY-MM-DD format.");
        error.statusCode = 400;
        throw error;
    }

    const provider = await Provider.findOne({ _id: providerId, isActive: true });
    if (!provider) {
        const error = new Error("Provider not found.");
        error.statusCode = 404;
        throw error;
    }

    const dayName = getDayName(date);
    const schedules = provider.availability.filter(item => item.day === dayName);
    const existing = await Appointment.find({
        provider: providerId,
        date,
        status: "confirmed"
    }).select("startTime");

    const booked = new Set(existing.map(item => item.startTime));
    const slots = [];

    for (const schedule of schedules) {
        const start = timeToMinutes(schedule.startTime);
        const end = timeToMinutes(schedule.endTime);

        for (let current = start; current + provider.slotDuration <= end; current += provider.slotDuration) {
            const startTime = minutesToTime(current);
            const endTime = minutesToTime(current + provider.slotDuration);

            if (!booked.has(startTime) && !isInPast(date, startTime)) {
                slots.push({ startTime, endTime });
            }
        }
    }

    return slots;
};

const validateProviderSlot = async (providerId, date, startTime) => {
    if (!isValidDateString(date) || !isValidTime(startTime)) {
        const error = new Error("Provide a valid date (YYYY-MM-DD) and time (HH:mm).");
        error.statusCode = 400;
        throw error;
    }

    const provider = await Provider.findOne({ _id: providerId, isActive: true });
    if (!provider) {
        const error = new Error("Provider not found or inactive.");
        error.statusCode = 404;
        throw error;
    }

    if (isInPast(date, startTime)) {
        const error = new Error("You cannot book an appointment in the past.");
        error.statusCode = 400;
        throw error;
    }

    const dayName = getDayName(date);
    const start = timeToMinutes(startTime);
    const schedule = provider.availability.find(item =>
        item.day === dayName &&
        start >= timeToMinutes(item.startTime) &&
        start + provider.slotDuration <= timeToMinutes(item.endTime) &&
        (start - timeToMinutes(item.startTime)) % provider.slotDuration === 0
    );

    if (!schedule) {
        const error = new Error("This time is outside the provider's available schedule.");
        error.statusCode = 400;
        throw error;
    }

    return {
        provider,
        endTime: minutesToTime(start + provider.slotDuration)
    };
};

module.exports = { getAvailableSlots, validateProviderSlot };
