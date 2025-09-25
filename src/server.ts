import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import studentCohort from "./routes/studentRoutes"
import CohortInform from "./routes/cohortRoutes"
import {swaggerDocs} from "./utils/swagger";

dotenv.config();

// Connect to MongoDB
connectDB();

// Explicit type: Application
const app: Application = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173","https://tech-builder-club.netlify.app","https://etb-server.onrender.com"], // your frontend origin
  credentials: true,
}));

app.use(helmet());
app.use(morgan("dev"));

// Routes

app.get("/", (req: Request, res: Response) => {
  res.send("Tech Builder Club API is running...");
});
app.use("/api/auth", userRoutes);
app.use("/api/cohort", studentCohort);
app.use("/api/cohort-inform", CohortInform);

// Swagger Docs
swaggerDocs(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
