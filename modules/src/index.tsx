import { Bold, createMethod, createModule, Line } from "kozz-module-maker";
import express from "express";
import { app } from "firebase-admin";
import AppRouter from "./Router";
import module from "./Kozz-Module";

const App = express();

App.use("/", AppRouter);

App.listen(1549, () => {
  console.log("started API server on port 1549");
});

console.log({ module });
