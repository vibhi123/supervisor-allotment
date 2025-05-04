import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import studentRouter from "./routes/student.routes.js"
import adminRouter from "./routes/admin.routes.js"
import facultyRouter from "./routes/faculty.routes.js"
import commonRouter from "./routes/common.routes.js"
import authRouter from "./routes/auth.routes.js"

//routes declaration
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/common", commonRouter);
app.use("/api/v1/auth", authRouter);

// http://localhost:8000/api/v1/users/register

export { app }