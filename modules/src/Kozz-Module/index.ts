import { createMethod, createModule } from "kozz-module-maker";

const module = createModule({
  name: "kozz",
  address: "ws://127.0.0.1:1984",
  commands: {
    boundariesToHandle: ["*"],
    methods: {
      ...createMethod("default", (requester) => {
        requester.reply("ONLINE!");
      }),
    },
  },
});

export default module;
