"use strict";
import db from "./mongo.js";
import findTd from "./routes/get.js";
import statusChanger from "./routes/changeStatus.js";
import findByStatus from "./routes/getCounter.js";
import post from "./routes/post.js";
import login from "./routes/login.js";
import registration from "./routes/registration.js";
import bodyParser from "koa-bodyparser";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(async (ctx, next) => {
  await next();
});
app.use(bodyParser());
app.use(async (ctx, next) => {
  await next();
});

db.connectDB();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
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
