require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "*"
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to SYNAPSE API",
        status: "Running",
        version: "1.0.0"
    });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/providers", require("./routes/providerRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        throw new Error("JWT_SECRET must be set and contain at least 32 characters.");
    }

    await connectDB();

    const port = process.env.PORT ;
    app.listen(port, "0.0.0.0", () => {
        console.log(`SYNAPSE API running on port ${port}`);
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
};

startServer().catch(error => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});
