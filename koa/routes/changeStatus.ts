import db from "../models/Todo";
import { Context, Next } from "koa";
import { Response } from "koa";
import { Request } from "koa";
const statusChanger = async (ctx: any, next: any) => {
  const status = ctx.request.body.status;
  console.log("status", status);

  const thisItem = parseInt(ctx.request.url.slice(14));
  console.log("ро", thisItem);
  const isTodoDefined = await db.Todo.find({ id: thisItem });

  /*if (!isTodoDefined) {
    res.writeHead(404, "todo is not defined");
  }*/

  const td = await db.Todo.updateOne(
    { id: thisItem },
    { $set: { status: status } }
  );
  ctx.status = 200;
  ctx.body = td;
};

export default statusChanger;
