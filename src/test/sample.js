"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unused-vars */
const schema_1 = require("../schema");
const const_1 = require("../const");
const gameList_1 = require("../client/Games/gameList");
function sample(game, someOnesSessionId) {
    // サーバーのルーム
    const room = game.room;
    // 自分のセッションID
    const playerSessionId = room.sessionId;
    // プレイヤーの座ってる位置
    const playerIndex = schema_1.Get(room.state.players, room.sessionId).index;
    const someOnePlayerIndex = schema_1.Get(room.state.players, someOnesSessionId).index;
    // 誰かのプレイヤー情報を得る
    const player = schema_1.Get(room.state.players, someOnesSessionId);
    // 全員のリストを取得
    const players = schema_1.GetAll(room.state.players);
    // 自分の手札の位置
    const pos = const_1.MASK_SHAPE_LIST[playerIndex];
    // 存在するゲームのリスト
    gameList_1.GAME_TYPE_LIST;
    // 現在行われているゲームの駒のリスト
    const compList = game.gameComponents;
}
