import bcrypt from "bcrypt";
import db from "../models/User";
import { Context, Next } from "koa";

const login = async (ctx: Context, next: Next) => {
  const { login, password } = ctx.request.body;
  const existingUser = await db.User.find({
    login: login,
  });
  const rounds = 10;

  if (existingUser.length === 0) {
    ctx.status = 400;
    ctx.body = "There is no such user. You have to registrate first";
    return;
  }
  let arePasswordsEqual = await bcrypt.compare(
    password,
    existingUser[0].password
  );
  if (arePasswordsEqual === false) {
    ctx.status = 400;
    ctx.body = "Password is incorrect";
    return;
  }

  ctx.status = 200;
  ctx.body = existingUser[0].id;
};

export default login;
