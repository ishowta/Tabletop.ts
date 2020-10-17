import { Room, Client } from 'colyseus'
import { Message } from '../message'
import { State, Player } from '../schema'
import _ from 'lodash'

export class GameRoom extends Room<State> {
  onCreate(): void {
    this.setState(new State())
  }
  onJoin(client: Client): void {
    const indexList = Object.values<Player>(this.state.players).map(
      (p) => p.index
    )
    let newIndex = _.range(0, 11).find((x) => !indexList.includes(x))
    if (newIndex === undefined) newIndex = -1
    this.state.players[client.sessionId] = new Player(newIndex)
    console.log(`New player id:${client.sessionId}, index:${newIndex}`)
  }
  onMessage(client: Client, message: Message): void {
    this.broadcast(message, { except: client })
  }
  onLeave(client: Client): void {
    delete this.state.players[client.sessionId]
  }
}
