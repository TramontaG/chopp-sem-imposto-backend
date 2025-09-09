import { Bold, createMethod, createModule, Line } from "kozz-module-maker";

const Greeting = () => (
  <>
    <Line>
      Hello from <Bold>Kozz-Bot!</Bold>
    </Line>
  </>
);

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
