import { GameType } from './client/Games/gameList'

export type Event =
  // カーソルの動きの共有
  | { type: 'moveCursor'; id: string; x: number; y: number }
  | { type: 'initUser'; id: string; name: string; index: number }
  | { type: 'initGame'; game: GameType; seed: string | undefined }
  | { type: 'moveComponent'; index: number; x: number; y: number }
  | { type: 'clickComponent'; index: number }
