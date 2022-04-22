import mongoose from "mongoose";

const connectDB = async () => {
  mongoose
    .connect("mongodb://localhost:27017/usersdb")
    .then(() => console.log("Connected Successfully"))
    .catch((err) => console.error("Not Connected", err));
};

export default { connectDB };
