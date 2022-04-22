import db from "../models/Todo";
import { Context, Next } from "koa";

const STATUSES = {
  active: 1,
  done: 0,
  deleted: 2,
};
const findTd = async (ctx: Context, next: Next) => {
  const userId = parseInt(ctx.request.url.slice(1));
  const td = await db.Todo.find({
    status: { $in: [STATUSES.active, STATUSES.done] },
    userId: userId,
  });
  console.log("userId", userId);
  ctx.status = 200;
  ctx.body = td;
};

export default findTd;
