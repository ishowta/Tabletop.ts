import { Trump } from './trump'

export type GameType = 'trump' | 'uno'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GAME_LIST: Record<GameType, any> = {
  trump: Trump,
  uno: Trump,
}
