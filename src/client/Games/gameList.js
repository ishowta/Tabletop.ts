"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_LIST = exports.GAME_TYPE_LIST = void 0;
const trump_1 = require("./trump");
const penguinparty_1 = require("./penguinparty");
const katan_1 = require("./katan");
exports.GAME_TYPE_LIST = ['trump', 'penguin', 'katan'];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.GAME_LIST = {
    trump: trump_1.PlayingCard,
    penguin: penguinparty_1.PenguinParty,
    katan: katan_1.Katan,
};
