import express from "express"
import dotenv from "dotenv"
dotenv.config();
import {dbConnect} from "./config/db.js";
import authRoute from "./routes/authRoute.js"
import cors from 'cors'
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.route.js";
import categoryRouter from './routes/category.route.js'
import variantRouter from "./routes/variant.route.js";
import uploadRouter from "./routes/productMedia.route.js";
import hotspotRouter from "./routes/hotspotRoute.js";

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
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/variant", variantRouter);
app.use("/api/upload-product", uploadRouter);
app.use("/api/hotspot", hotspotRouter)



app.listen(port, () => console.log(`Server running on port ${port}`));

