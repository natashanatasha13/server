import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  value: String,
  id: Number,
  status: Number,
  filter: String,
  userId: Number,
});

const Todo = mongoose.model("Todos", TodoSchema);

export default { Todo };
