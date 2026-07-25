import express from "express"
import dotenv from "dotenv"
dotenv.config();
import {dbConnect} from "./config/db.js";
import authRoute from "./routes/authRoute.js"
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express()

const port = process.env.PORT

app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

dbConnect();

app.use('/api/auth',authRoute);



app.listen(port, () => console.log(`Server running on port ${port}`));

