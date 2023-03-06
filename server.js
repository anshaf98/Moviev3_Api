import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import userRoute from "./routes/UserRoute.js";
import movieRoute from "./routes/MovieRoute.js";
import categoriesRoute from "./routes/CategoryRoute.js";
import UploadRoute from "./controller/UploadFile.js";

import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

// ? CONNECT DB
connectDB();

// ? MAIN ROUTE
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ? OTHER ROUTE
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/upload", UploadRoute);

// ? ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
