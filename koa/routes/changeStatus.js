import db from "../models/Todo.js";

const statusChanger = async (ctx, next) => {
  const { status } = ctx.request.body;

  const thisItem = parseInt(ctx.request.url.slice(14));

  const isTodoDefined = await db.Todo({ id: thisItem });

  if (!isTodoDefined) {
    res.writeHead(404, "todo is not defined");
  }

  const td = await db.Todo.updateOne(
    { id: thisItem },
    { $set: { status: status } }
  );
  ctx.status = 200;
  ctx.body = td;
};

export default statusChanger;
