import bcrypt from "bcrypt";
import db from "../models/User";
import { Context, Next } from "koa";

const registration = async (ctx: Context, next: Next) => {
  const { login, username, password } = ctx.request.body;
  const id = await db.User.count();
  const rounds = 10;

  const hash = await bcrypt.hash(password, rounds);

  const newUser = new db.User({
    login,
    password: hash,
    id,
  });
  const correctPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  const existingLogin = await db.User.find({ login: newUser.login });
  console.log("second", existingLogin);
  if (existingLogin.length !== 0) {
    ctx.status = 400;
    console.log("This login has already been taken");
    return;
  }
  if (login.length < 5) {
    ctx.status = 400;
    console.log("The login  has to contain at least 5 symbols");
    return;
  }
  if (!password.match(correctPassword)) {
    ctx.status = 400;
    ctx.body =
      "Password has to be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase lette";
    return;
  }
  ctx.status = 200;
  ctx.body = newUser;

  await newUser.save();
};

export default registration;
