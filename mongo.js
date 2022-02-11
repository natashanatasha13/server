const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect("mongodb://localhost:27017/usersdb")
    .then(() => console.log("Connected Successfully"))
    .catch((err) => console.error("Not Connected", err));
};

const TodoSchema = new mongoose.Schema({
  value: String,
  id: Number,
  status: Number,
  filter: String,
});

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = { connectDB, Todo };
