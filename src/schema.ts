import { Schema, MapSchema, type } from '@colyseus/schema'

export class Player extends Schema {
  @type('number') index: number
  @type('string') name = 'User'
  constructor(index: number) {
    super()
    this.index = index
  }
}

export class State extends Schema {
  @type('number') count = 0
  @type({ map: Player }) players = new MapSchema<Player>()
}
