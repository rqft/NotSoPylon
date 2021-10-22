import { readFileSync } from "fs";
import fetch from "node-fetch";
import { Pariah } from "pariah";
import { exit } from "process";
import { WebSocket } from "ws";
import * as Permissions from "./permissions";
function sleep(n: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
const defaultMainText = `/* 
             __ _                              
            / _| |                             
  _ __ __ _| |_| |_   ___ _ __   __ _  ___ ___ 
 | '__/ _\` |  _| __| / __| '_ \\ / _\` |/ __/ _ \\
 | | | (_| | | | |_ _\\__ \ |_) | (_| | (_|  __/
 |_|  \\__, |_|  \\__(_)___/ .__/ \\__,_|\\___\\___|
         | |             | |                   
         |_|             |_|                   
 */`;

require("dotenv").config();

const pylonApi = new Pariah({
  baseUrl: "https://pylon.bot/",
  headers: {
    Authorization: process.env.PYLON_TOKEN,
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36", // lol
  },
});

async function getActivePylonGuilds() {
  const txt = await pylonApi.getText("/api/users/guilds/");
  if (txt === "unauthorized") {
    console.log("unauthorized at /api/user/guilds/");
    throw new Error("Pylon Token Unauthorized");
  }
  const json = JSON.parse(txt);
  return json;
}

const deployments = {};
async function getDeployment(id: string) {
  if (typeof deployments[id] === "object" && deployments[id] !== null) {
    return deployments[id];
  }
  if (!id || (typeof id === "string" && id.length < 2)) {
    return null;
  }

  const json = await pylonApi.getJSON<{ deployments: any }>(
    `/api/guilds/${id}`
  );
  deployments[id] = json.deployments;
  return json.deployments;
}

async function getValidGuilds() {
  const active = await getActivePylonGuilds();
  sleep(1);
  const txt = await pylonApi.getText("/api/user/guilds/available");
  if (txt === "unauthorized") {
    console.log("unauthorized at /api/user/guilds/available/");
    throw new Error("Pylon Token Unauthorized");
  }
  const json = JSON.parse(txt);
  const valid = json.filter(
    (val) =>
      active.find((v) => v.id === val.id) !== undefined &&
      new Permissions(val.permissions).has("MANAGE_GUILD")
  );
  return valid;
}
async function getDeploymentIds() {
  const toRet = { deployments: [], skipped: [], added: [], failed: [] };

  const dept = await getDeployment(process.env.TEST_GUILD);
  if (dept) {
    const correctDep = dept.find(
      (vall) => vall.disabled === false && vall.bot_id === "270148059269300224"
    );
    if (correctDep !== undefined) {
      toRet.deployments.push(correctDep.id);
      return toRet;
    }
  }
  console.error("Failed to grab deployment, data: ", dept);
  return null;
}

function deserialize(value) {
  if (typeof value === "object" && value !== null) {
    switch (value["@t"]) {
      case "[[undefined]]":
        return undefined;
      case "Function": {
        const f = function renameMe() {};
        Object.defineProperty(f, "name", {
          value: value.data.name,
        });
        return f;
      }
      case "BigInt":
        return BigInt(value.data.value);
      default:
        break;
    }
    if (Array.isArray(value)) {
      return value.map(deserialize);
    }
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => {
        if (typeof k === "string" && k.startsWith("#") && k.endsWith("@t")) {
          k = k.slice(1);
        }
        return [k, deserialize(v)];
      })
    );
  }
  return value;
}

function workbenchWs(url) {
  const ws = new WebSocket(url);
  ws.onopen = () => console.log("WS Open");
  ws.onmessage = (e) => {
    // @ts-ignore
    const data = JSON.parse(e.data);
    console[data[0].method]("PYLON LOG:", ...data[0].data.map(deserialize));
  };
  ws.onerror = console.error;
  ws.onclose = () => workbenchWs(url);
}
const done = [];

(async () => {
  const deps = await getDeploymentIds();
  if (!deps) throw new Error("Failed to fetch deployment IDs, closing");
  const { deployments: ids, added, failed, skipped } = deps;
  console.log(ids, skipped, failed, added);

  for (let key in ids) {
    const id = ids[key];
    if (done.includes(id)) return;

    done.push(id);
    const bundle = readFileSync("./dist/bundle.js", "utf-8");
    if (!bundle) {
      console.error("failed to get code");
      exit(1);
    }
    try {
      const req = await fetch(`${pylonApi.baseUrl}api/deployments/${id}`, {
        method: "POST",
        headers: {
          Authorization: process.env.PYLON_TOKEN,
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
        },
        body: JSON.stringify({
          script: {
            contents: bundle,
            project: {
              files: [{ path: "/main.ts" }],
              content: defaultMainText,
            },
          },
        }),
      });
      console.log(req);
      const obj = await req.json();

      if (typeof obj.msg === "string") {
        console.error(`Publish error: ${obj.msg}`);
        exit(1);
      } else {
        console.info("ok published");
        // workbenchWs(obj.workbench_url);
      }
    } catch (r) {
      console.error(`Publish error: ${r.url} > ${r.status} - ${r.statusText}`);
      console.error(r);
      exit(1);
    }
  }
  console.info("ok deployed");
})().catch((e) => {
  console.error(`error: ${e}`);
  exit(1);
});
