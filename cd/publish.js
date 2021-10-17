"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var fs_1 = require("fs");
var node_fetch_1 = require("node-fetch");
var pariah_1 = require("pariah");
var process_1 = require("process");
var ws_1 = require("ws");
var Permissions = require("./permissions");
function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
var defaultMainText = "/* \n             __ _                              \n            / _| |                             \n  _ __ __ _| |_| |_   ___ _ __   __ _  ___ ___ \n | '__/ _` |  _| __| / __| '_ \\ / _` |/ __/ _ \\\n | | | (_| | | | |_ _\\__  |_) | (_| | (_|  __/\n |_|  \\__, |_|  \\__(_)___/ .__/ \\__,_|\\___\\___|\n         | |             | |                   \n         |_|             |_|                   \n */";
require("dotenv").config();
var pylonApi = new pariah_1.Pariah({
    baseUrl: "https://pylon.bot/",
    headers: {
        Authorization: process.env.PYLON_TOKEN,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
    }
});
function getActivePylonGuilds() {
    return __awaiter(this, void 0, void 0, function () {
        var txt, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pylonApi.getText("/api/users/guilds/")];
                case 1:
                    txt = _a.sent();
                    if (txt === "unauthorized") {
                        console.log("unauthorized at /api/user/guilds/");
                        throw new Error("Pylon Token Unauthorized");
                    }
                    json = JSON.parse(txt);
                    return [2 /*return*/, json];
            }
        });
    });
}
var deployments = {};
function getDeployment(id) {
    return __awaiter(this, void 0, void 0, function () {
        var json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof deployments[id] === "object" && deployments[id] !== null) {
                        return [2 /*return*/, deployments[id]];
                    }
                    if (!id || (typeof id === "string" && id.length < 2)) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, pylonApi.getJSON("/api/guilds/" + id)];
                case 1:
                    json = _a.sent();
                    deployments[id] = json.deployments;
                    return [2 /*return*/, json.deployments];
            }
        });
    });
}
function getValidGuilds() {
    return __awaiter(this, void 0, void 0, function () {
        var active, txt, json, valid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getActivePylonGuilds()];
                case 1:
                    active = _a.sent();
                    sleep(1);
                    return [4 /*yield*/, pylonApi.getText("/api/user/guilds/available")];
                case 2:
                    txt = _a.sent();
                    if (txt === "unauthorized") {
                        console.log("unauthorized at /api/user/guilds/available/");
                        throw new Error("Pylon Token Unauthorized");
                    }
                    json = JSON.parse(txt);
                    valid = json.filter(function (val) {
                        return active.find(function (v) { return v.id === val.id; }) !== undefined &&
                            new Permissions(val.permissions).has("MANAGE_GUILD");
                    });
                    return [2 /*return*/, valid];
            }
        });
    });
}
function getDeploymentIds() {
    return __awaiter(this, void 0, void 0, function () {
        var toRet, dept, correctDep;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    toRet = { deployments: [], skipped: [], added: [], failed: [] };
                    return [4 /*yield*/, getDeployment(process.env.TEST_GUILD)];
                case 1:
                    dept = _a.sent();
                    if (dept) {
                        correctDep = dept.find(function (vall) { return vall.disabled === false && vall.bot_id === "270148059269300224"; });
                        if (correctDep !== undefined) {
                            toRet.deployments.push(correctDep.id);
                            return [2 /*return*/, toRet];
                        }
                    }
                    console.error("Failed to grab deployment, data: ", dept);
                    return [2 /*return*/, null];
            }
        });
    });
}
function deserialize(value) {
    if (typeof value === "object" && value !== null) {
        switch (value["@t"]) {
            case "[[undefined]]":
                return undefined;
            case "Function": {
                var f = function renameMe() { };
                Object.defineProperty(f, "name", {
                    value: value.data.name
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
        return Object.fromEntries(Object.entries(value).map(function (_a) {
            var k = _a[0], v = _a[1];
            if (typeof k === "string" && k.startsWith("#") && k.endsWith("@t")) {
                k = k.slice(1);
            }
            return [k, deserialize(v)];
        }));
    }
    return value;
}
function workbenchWs(url) {
    var ws = new ws_1.WebSocket(url);
    ws.onopen = function () { return console.log("WS Open"); };
    ws.onmessage = function (e) {
        // @ts-ignore
        var data = JSON.parse(e.data);
        console[data[0].method].apply(console, __spreadArray(["PYLON LOG:"], data[0].data.map(deserialize)));
    };
    ws.onerror = console.error;
    ws.onclose = function () { return workbenchWs(url); };
}
var done = [];
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var deps, ids, added, failed, skipped, _a, _b, _i, key, id, bundle, req, obj, r_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, getDeploymentIds()];
            case 1:
                deps = _c.sent();
                if (!deps)
                    throw new Error("Failed to fetch deployment IDs, closing");
                ids = deps.deployments, added = deps.added, failed = deps.failed, skipped = deps.skipped;
                console.log(ids, skipped, failed, added);
                _a = [];
                for (_b in ids)
                    _a.push(_b);
                _i = 0;
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                key = _a[_i];
                id = ids[key];
                if (done.includes(id))
                    return [2 /*return*/];
                done.push(id);
                bundle = fs_1.readFileSync("./dist/bundle.js", "utf-8");
                if (!bundle) {
                    console.error("failed to get code");
                    process_1.exit(1);
                }
                _c.label = 3;
            case 3:
                _c.trys.push([3, 6, , 7]);
                return [4 /*yield*/, node_fetch_1["default"](pylonApi.baseUrl + "api/deployments/" + id, {
                        method: "POST",
                        headers: {
                            Authorization: process.env.PYLON_TOKEN,
                            "Content-Type": "application/json",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
                        },
                        body: JSON.stringify({
                            script: {
                                contents: bundle,
                                project: {
                                    files: [{ path: "/main.ts" }],
                                    content: defaultMainText
                                }
                            }
                        })
                    })];
            case 4:
                req = _c.sent();
                console.log(req);
                return [4 /*yield*/, req.json()];
            case 5:
                obj = _c.sent();
                if (typeof obj.msg === "string") {
                    console.error("Publish error: " + obj.msg);
                    process_1.exit(1);
                }
                else {
                    console.info("ok published");
                    // workbenchWs(obj.workbench_url);
                }
                return [3 /*break*/, 7];
            case 6:
                r_1 = _c.sent();
                console.error("Publish error: " + r_1.url + " > " + r_1.status + " - " + r_1.statusText);
                console.error(r_1);
                process_1.exit(1);
                return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8:
                console.info("ok deployed");
                return [2 /*return*/];
        }
    });
}); })()["catch"](function (e) {
    console.error("error: " + e);
    process_1.exit(1);
});
