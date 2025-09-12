import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// utils
import connectDB from "./db/db.js";

//Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is Running on http://localhost:${PORT}`);
    });
}).catch((err) =>{
    console.error(`Failed to connect DB: ${err}`);
    process.exit(1);
});