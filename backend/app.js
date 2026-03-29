import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import authRoutes from './http/routes/auth.routes.js';
import userRoutes from './http/routes/users.routes.js';
import courseRoutes from './http/routes/course.routes.js';
import env from './env.js';
import { fileURLToPath } from "url";
import path from "path";
import assignmentRoutes from "./http/routes/assignment.routes.js";
import progressRoutes from "./http/routes/progress.routes.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = env.PORT || 4444;

app.use(cors({
    origin: env.CORS_ORIGIN
}));

const httpServer = createServer(app);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/courses', courseRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", assignmentRoutes);
app.use("/api", progressRoutes);

httpServer.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})