import { NotSoCommand } from "../internals/client";

let infoCommands: NotSoCommand[] = [
  {
    name: "activity",
    args: (args) => ({
      user: args.string(),
    }),
    run: (message, { user }) => {
      const { user } = args;
    },
  },
];
infoCommands = infoCommands.map((v) => ({
  ...v,
  meta: { ...v.meta, category: "Info " },
}));
export { infoCommands };
