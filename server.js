"use strict";
const db = require("./mongo.js");

const STATUSES = {
  active: 1,
  done: 0,
  deleted: 2,
};
let length = -1;
const http = require("http");

const server = http.createServer();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Max-Age": 2592000,
};
const statusChanger = (statusArg, request, response) => {
  const thisItem = parseInt(request.url.slice(14));
  const isTodoDefined = db.Todo({ id: thisItem });

  if (!isTodoDefined) {
    console.log(thisItem);
    response.writeHead(404, "todo is not defined");
  }

  const findTd = async () => {
    try {
      await db.Todo.updateOne(
        { id: thisItem },
        { $set: { status: statusArg } }
      );
    } catch (e) {
      print(e);
    }
  };

  findTd();
  return;
};

server.on("request", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.method === "GET") {
    const findTd = async () => {
      const td = await db.Todo.find({ status: { $in: [0, 1] } });
      res.end(JSON.stringify(td));
    };

    if (JSON.stringify(req.url).includes("getCounter")) {
      const thisItem = parseInt(req.url.slice(12));
      const findByStatus = async (status) => {
        if (status === 3) {
          const td = await db.Todo.find({ status: 1 });
          res.end(JSON.stringify(td.length));
        } else {
          const td = await db.Todo.find({ status: status });
          res.end(JSON.stringify(td.length));
        }
      };

      findByStatus(thisItem);
      return;
    }

    findTd();
    return;
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const value = JSON.parse(body).value;
      const status = JSON.parse(body).status;
      const id = await db.Todo.count();
      const filter = JSON.parse(body).filter;

      if (JSON.stringify(req.url).includes("changeStatus")) {
        statusChanger(status, req, res);
        res.end();
        return;
      }

      if (JSON.stringify(req.url).includes("changeFilter")) {
        const filterChanger = async () => {
          await db.Todo.updateMany(
            {},
            { $set: { filter: filter } },
            { upsert: false, multi: true }
          );
          return;
        };
        filterChanger();
        console.log("filterChanged");
        res.end();
        return;
      }

      const newTodo = new db.Todo({
        value,
        status,
        id,
        filter,
      });
      await newTodo.save();

      res.end(JSON.stringify(newTodo));
    });
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log(`Server started at http://${"127.0.0.1"}:${3000}/`);
  db.connectDB();
});
