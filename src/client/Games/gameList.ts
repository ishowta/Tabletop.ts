import { Trump } from './trump'
import { PenguinParty } from './penguinparty'

export const GAME_TYPE_LIST = ['trump', 'penguin'] as const
export type GameType = typeof GAME_TYPE_LIST[number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GAME_LIST: Record<GameType, any> = {
  trump: Trump,
  penguin: PenguinParty,
}
