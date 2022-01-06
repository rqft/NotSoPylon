import "./commands/";

export const LoopActions: Record<string, () => unknown | Promise<unknown>> = {};

pylon.tasks.cron("loop", "0 0/5 * * * *", async () => {
  for (let [key, value] of Object.entries(LoopActions)) {
    try {
      await value();
      console.info(`Successfully ran loop on \`${key}\``);
    } catch (e) {
      console.error(`Error while running loop on \`${key}\`: ${e}`);
    }
  }
});
