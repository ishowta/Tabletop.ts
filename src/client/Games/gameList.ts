import { PlayingCard } from './trump'
import { PenguinParty } from './penguinparty'
import { Katan } from './katan'

export const GAME_TYPE_LIST = ['trump', 'penguin', 'katan'] as const
export type GameType = typeof GAME_TYPE_LIST[number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GAME_LIST: Record<GameType, any> = {
  trump: PlayingCard,
  penguin: PenguinParty,
  katan: Katan,
}
