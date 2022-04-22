import db from "../models/Todo";
import { Context, Next } from "koa";

const STATUSES = {
  active: 1,
  done: 0,
  deleted: 2,
};

const findByStatus = async (ctx: Context, next: Next) => {
  const thisStatus = parseInt(ctx.request.url.slice(12));

  if (thisStatus === 3) {
    const td = await db.Todo.find({ status: STATUSES.active });
    const length = td.length;
    ctx.status = 200;
    ctx.body = td;
  } else {
    const td = await db.Todo.find({ status: thisStatus });

    ctx.status = 200;
    ctx.body = td;
  }
};

export default findByStatus;
