import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is Running on http://localhost:${PORT}`);
    });
}).catch((err) =>{
    console.error(`Failed to connect DB: ${err}`);
    process.exit(1);
});