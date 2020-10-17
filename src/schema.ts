import { Schema, MapSchema, type } from '@colyseus/schema'

export class Player extends Schema {
  @type('number') index: number
  constructor(index: number) {
    super()
    this.index = index
  }
}

export class State extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>()
}
