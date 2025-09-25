"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const cohortRoutes_1 = __importDefault(require("./routes/cohortRoutes"));
const swagger_1 = require("./utils/swagger");
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.default)();
// Explicit type: Application
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://tech-builder-club.netlify.app"], // your frontend origin
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
// Routes
app.get("/", (req, res) => {
    res.send("Tech Builder Club API is running...");
});
app.use("/api/auth", userRoutes_1.default);
app.use("/api/cohort", studentRoutes_1.default);
app.use("/api/cohort-inform", cohortRoutes_1.default);
// Swagger Docs
(0, swagger_1.swaggerDocs)(app);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
