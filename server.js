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

let todos = [];

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Max-Age": 2592000,
};
const statusChanger = (statusArg, request, response) => {
  const thisItem = parseInt(request.url.slice(14));
  const isTodoDefined = todos.find((todo) => {
    return todo.id === thisItem;
  });
  console.log(todos);
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
      const td = await db.Todo.find();
      res.end(JSON.stringify(td));
    };
    findTd();
    return;
  }

  if (req.method === "DELETE") {
    const deletedItem = parseInt(req.url.slice(1));
    const isTodoDefined = todos.find((todo) => {
      return todo.id === deletedItem;
    });

    if (!isTodoDefined) {
      res.writeHead(404, "todo is not defined");

      res.end();
      return;
    }
    db.Todo.remove({ id: deletedItem }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Result :", result);
      }
    });
    todos = todos.filter((todo) => todo.id !== deletedItem);
    res.end("deleted");
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
      const id = JSON.parse(body).id;
      const filter = JSON.parse(body).filter;

      /* if (todos.length > length) {
        length = todos.length;
      } else {
      }*/

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

      const pushinTodos = async () => {
        const td = await db.Todo.find();
        todos.push(td[td.length - 1]);
        console.log("filled", todos);
      };

      pushinTodos();
      res.end("added");
    });
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log(`Server started at http://${"127.0.0.1"}:${3000}/`);
  db.connectDB();
});
