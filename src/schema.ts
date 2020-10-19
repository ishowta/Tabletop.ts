import { Schema, MapSchema, type } from '@colyseus/schema'

export class Player extends Schema {
  /** 座る位置 */
  @type('number') index: number
  /** 名前 */
  @type('string') name = ''
  constructor(index: number) {
    super()
    this.index = index
  }
}

export class State extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>()
}

/** Get value */
export function Get<T>(map: MapSchema<T>, key: string): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return map[key] as T
}

/** Get values (Don't use inheritance!) */
export function GetAll<T>(map: MapSchema<T>): T[] {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return Object.values(map) as T[]
}
