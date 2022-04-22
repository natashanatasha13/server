"use strict";
import db from "./mongo";
import findTd from "./routes/get";
import statusChanger from "./routes/changeStatus";
import findByStatus from "./routes/getCounter";
import post from "./routes/post";
import login from "./routes/login";
import registration from "./routes/registration";
import bodyParser from "koa-bodyparser";
import Koa from "koa";
import Router from "koa-router";
import cors from "koa-cors";
import { Context, Next } from "koa";

const app: Koa = new Koa();
const router: Router = new Router();

app.use(cors());
app.use(async (ctx, next) => {
  await next();
});
app.use(bodyParser());
app.use(async (ctx, next) => {
  await next();
});

db.connectDB();

app.use(async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    console.log(err.status);
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
});

router.post("/", post);
router.post("/id", post);
router.post("/user", registration);
router.post("/login", login);
router.get(`/:id`, findTd);
router.get(`/getCounter/:filterValue`, findByStatus, findTd);
router.post(`/changeStatus/:id`, statusChanger, findTd);

app.use(router.routes());
app.listen(3000);
