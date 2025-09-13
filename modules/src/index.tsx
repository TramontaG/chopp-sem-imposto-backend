import { Bold, createMethod, createModule, Line } from "kozz-module-maker";
import express from "express";
import { app } from "firebase-admin";
import AppRouter from "./Router";

const Greeting = () => (
  <>
    <Line>
      Hello from <Bold>Kozz-Bot!</Bold>
    </Line>
  </>
);

const App = express();

App.use("/", AppRouter);

App.listen(1549, () => {
  console.log("started API server on port 1549");
});

createModule({
  name: "kozz",
  address: "ws://127.0.0.1:4521",
  commands: {
    boundariesToHandle: ["*"],
    methods: {
      ...createMethod("default", (requester) => {
        requester.reply(<Greeting />);
      }),
    },
  },
});
