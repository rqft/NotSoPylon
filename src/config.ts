import { Timezones } from "./globals";
export const TAG_KV = new pylon.KVNamespace("tags");
const config = {
  prefixes: [".", "use "],

  clientOwners: ["504698587221852172"],
  timezone: "America/Chicago" as Timezones,
  storage: {
    channelId: "888962409144909876",
    identifier: `store-:rand: :filename:`,
  },
  keys: {
    imagga:
      "Basic YWNjX2M3ZjAzMjgyMTJmNDE4NDphN2UxMDBkOWQ4YzliZjM1YzgzMThlODMyMjdjNWIyNw==",
    pxl_api: "aa3ea3b19fd2ea39ab1d8aff7c57af5b", //private
    imgix: "", //private
    discard_cc: "", //private
  },
};
export default config;
