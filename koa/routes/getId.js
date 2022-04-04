import bcrypt from "bcrypt";
import db from "../models/User.js";
const findId = async (ctx, next) => {
  const userId = parseInt(ctx.request.url.slice(1));
  const td = await db.Todo.find({
    status: { $in: [STATUSES.active, STATUSES.done] },
    userId: userId,
  });
  console.log(userId);
  ctx.status = 200;
  ctx.body = newUser;

  await newUser.save();
};

export default registration;
