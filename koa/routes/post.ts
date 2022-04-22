import db from "../models/Todo";
import { Context, Next } from "koa";

const STATUSES = {
  active: 1,
  done: 0,
  deleted: 2,
};
const post = async (ctx: Context, next: Next) => {
  const { value, status, userId } = ctx.request.body;

  const id = await db.Todo.count();

  const newTodo = new db.Todo({
    value,
    status,
    id,
    userId,
  });
  await newTodo.save();

  ctx.status = 200;
  ctx.body = newTodo;
};

export default post;
