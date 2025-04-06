import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectdb from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import User from './models/User.js';
import Faculty from './models/Faculty.Model.js';


// App config
const app = express();
const port = process.env.PORT || 8000;
connectdb();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/student", authMiddleware, studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);


app.get("/", (req, res) => {
    res.send("Backend Running.");
})

app.listen(port, () => {
    console.log("Listening to port : " + port)
})

// app.get('/api/srv/reset', async (req, res) => {
//     try {
//       const result1 = await User.updateMany({}, { $set: { rank: 0, supervisor: null } });
//       const result2 = await Faculty.updateMany({}, { $set: { student: [] } });
//       res.json({ message: 'All users updated', studentCount: result1.modifiedCount, facultyCount: result2.modifiedCount });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });