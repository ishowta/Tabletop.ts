/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Get, State, GetAll } from '../schema'
import { Room } from 'colyseus.js'
import { MASK_SHAPE_LIST } from '../const'
import Tabletop from '../client/gamescene'
import { GAME_TYPE_LIST } from '../client/Games/gameList'

function sample(game: Tabletop, someOnesSessionId: string) {
  // サーバーのルーム
  const room = game.room

  // 自分のセッションID
  const playerSessionId = room.sessionId

  // プレイヤーの座ってる位置
  const playerIndex = Get(room.state.players, room.sessionId).index
  const someOnePlayerIndex = Get(room.state.players, someOnesSessionId).index

  // 誰かのプレイヤー情報を得る
  const player = Get(room.state.players, someOnesSessionId)

  // 全員のリストを取得
  const players = GetAll(room.state.players)

  // 自分の手札の位置
  const pos = MASK_SHAPE_LIST[playerIndex]

  // 存在するゲームのリスト
  GAME_TYPE_LIST

  // 現在行われているゲームの駒のリスト
  const compList = game.gameComponents
}
