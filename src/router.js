"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const colyseus_1 = require("colyseus");
const monitor_1 = require("@colyseus/monitor");
const node_watch_1 = __importDefault(require("node-watch"));
const child_process_1 = require("child_process");
const gameroom_1 = require("./server/gameroom");
const dotenv_1 = __importDefault(require("dotenv"));
const node_v8_1 = require("node:v8");
dotenv_1.default.config();
if (process.env.SERVER_ADDRESS === undefined || process.env.SERVER_PORT === undefined)
    throw new Error('.env not found');
const ADDRESS = process.env.SERVER_ADDRESS;
const PORT = process.env.SERVER_PORT;
const ISDEV = process.env.NODE_ENV === 'development';
const STATIC_PATH = '../static';
const STATIC_BUILD_COMMAND = `yarn esbuild ./src/client/index.ts --bundle --sourcemap --platform=browser --define:process.env=\\"${JSON.stringify(dotenv_1.default.config().parsed)}\\" --outfile=./static/_dist_/dev.js`;
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
const gameServer = new colyseus_1.Server({
    server: http_1.createServer(app),
    express: app,
});
gameServer.define('game', gameroom_1.GameRoom);
app.use('/', express_1.default.static(path_1.default.join(__dirname, STATIC_PATH)));
if (ISDEV)
    app.use('/colyseus', monitor_1.monitor());
gameServer.onShutdown(function () {
    console.log(`game server is going down.`);
});
gameServer
    .listen(parseInt(PORT))
    .then(() => {
    console.log(`Listening on ${ADDRESS}`);
    node_v8_1.writeHeapSnapshot("snap.log");
    console.log("snapped");
})
    .catch(e => {
    console.log(`Cannot listen.`, e);
});
const build = () => {
    child_process_1.exec(STATIC_BUILD_COMMAND, (error, _stdout, stderror) => {
        if (error != null) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderror) {
            console.log(`stderr: ${stderror}`);
            return;
        }
    });
};
build();
if (ISDEV) {
    // Hot reload
    node_watch_1.default('./src', { recursive: true }, function (_evt, _name) {
        console.log(`${_name != null ? _name : ''} changed.`);
        build();
    });
}
