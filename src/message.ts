import { GameType } from './client/Games/gameList'

export type Message =
  | { type: 'init'; game: GameType }
  | { type: 'move'; index: number; x: number; y: number }
  | { type: 'click'; index: number }
