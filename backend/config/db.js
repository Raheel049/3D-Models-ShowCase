import mongoose from "mongoose"


export const dbConnect = () => {
    const URI = process.env.MONGODB_URI;

    mongoose.connect(URI)
    .then(() => console.log("Database connected successfully!"))
    .catch((error) => console.log("through error", error))
}