const express = require("express");

const server = express();

server.use(express.json());
const actionRouter = require("./routers/actionRouter");
const projectRouter = require("./routers/projectRouter");

server.use("/actions/", actionRouter);
server.use("/projects", projectRouter);

server.get("/", (req, res) => {
  res.send("<h1>It's working!! Yay</h1>");
});

module.exports = server;
