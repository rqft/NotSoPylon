import { Timezones } from "./globals";

const config = {
  prefix: ".",
  timezone: "America/Chicago" as Timezones,
  storage: {
    channelId: "1234567812345678",
    identifier: `store-{rand} {filename}`,
  },
};
export default config;
