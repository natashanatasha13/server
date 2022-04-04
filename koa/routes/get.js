import db from "../models/Todo.js";

const STATUSES = {
  active: 1,
  done: 0,
  deleted: 2,
};
const findTd = async (ctx, next) => {
  const userId = parseInt(ctx.request.url.slice(1));
  const td = await db.Todo.find({
    status: { $in: [STATUSES.active, STATUSES.done] },
    userId: userId,
  });
  console.log(userId);
  ctx.status = 200;
  ctx.body = td;
};

export default findTd;
