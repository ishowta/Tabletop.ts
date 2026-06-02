"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const colyseus_1 = require("colyseus");
const schema_1 = require("../schema");
const lodash_1 = __importDefault(require("lodash"));
class GameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.formatPlayerStatus = (client) => `id:${client.sessionId}, index:${schema_1.Get(this.state.players, client.sessionId).index}`;
    }
    onCreate() {
        this.setState(new schema_1.State());
    }
    onJoin(client) {
        // Make state
        const indexList = Object.values(this.state.players).map(p => p.index);
        let newIndex = lodash_1.default.range(0, 11).find(x => !indexList.includes(x));
        if (newIndex === undefined)
            newIndex = -1;
        this.state.players[client.sessionId] = new schema_1.Player(newIndex);
        console.log(`New player ${this.formatPlayerStatus(client)}`);
    }
    onLeave(client) {
        console.log(`Leave player ${this.formatPlayerStatus(client)}`);
        // Remove state
        delete this.state.players[client.sessionId];
    }
    onMessage(client, message) {
        // Pre hook
        switch (message.type) {
            case 'initUser':
                message.id = client.sessionId;
                message.index = schema_1.Get(this.state.players, client.sessionId).index;
                schema_1.Get(this.state.players, client.sessionId).name = message.name;
                break;
            case 'initGame':
                // シャッフル等の乱数のシード値を共有する
                message.seed = Math.random().toString(32).substring(2);
                break;
            default:
        }
        // Broadcast
        switch (message.type) {
            case 'moveCursor':
            case 'pointerDownComponent':
            case 'moveComponent':
                // ※移動処理は応答性が重要でクライアントは自分自身の移動イベントはサーバーを介さずに実行しているため、Broadcastから除外する
                this.broadcast(message, { except: client });
                break;
            default:
                this.broadcast(message);
        }
    }
}
exports.GameRoom = GameRoom;
