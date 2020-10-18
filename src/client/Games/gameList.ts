import { Trump } from './trump'
import { PenguinParty } from './penguinparty'

export type GameType = 'trump' | 'penguin'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GAME_LIST: Record<GameType, any> = {
  trump: Trump,
  penguin: PenguinParty,
}
