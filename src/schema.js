"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAll = exports.Get = exports.State = exports.Player = void 0;
const schema_1 = require("@colyseus/schema");
class Player extends schema_1.Schema {
    constructor(index) {
        super();
        /** 名前 */
        this.name = '';
        this.index = index;
    }
}
__decorate([
    schema_1.type('number')
], Player.prototype, "index", void 0);
__decorate([
    schema_1.type('string')
], Player.prototype, "name", void 0);
exports.Player = Player;
class State extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
    }
}
__decorate([
    schema_1.type({ map: Player })
], State.prototype, "players", void 0);
exports.State = State;
/** Get value */
function Get(map, key) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return map[key];
}
exports.Get = Get;
/** Get values (Don't use inheritance!) */
function GetAll(map) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Object.values(map);
}
exports.GetAll = GetAll;
