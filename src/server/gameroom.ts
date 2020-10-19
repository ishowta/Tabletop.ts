import { Room, Client } from 'colyseus'
import { Event } from '../event'
import { State, Player, Get } from '../schema'
import _ from 'lodash'

export class GameRoom extends Room<State> {
  onCreate(): void {
    this.setState(new State())
  }

  onJoin(client: Client): void {
    // Make state
    const indexList = Object.values<Player>(this.state.players).map(p => p.index)
    let newIndex = _.range(0, 11).find(x => !indexList.includes(x))
    if (newIndex === undefined) newIndex = -1
    this.state.players[client.sessionId] = new Player(newIndex)

    console.log(`New player ${this.formatPlayerStatus(client)}`)
  }

  onLeave(client: Client): void {
    console.log(`Leave player ${this.formatPlayerStatus(client)}`)

    // Remove state
    delete this.state.players[client.sessionId]
  }

  onMessage(client: Client, message: Event): void {
    // Pre hook
    switch (message.type) {
      case 'initUser':
        message.id = client.sessionId
        message.index = Get(this.state.players, client.sessionId).index
        Get(this.state.players, client.sessionId).name = message.name
        break
      case 'initGame':
        // シャッフル等の乱数のシード値を共有する
        message.seed = Math.random().toString(32).substring(2)
        break
      default:
    }

    // Broadcast
    switch (message.type) {
      case 'moveCursor':
      case 'moveComponent':
        // ※移動処理は応答性が重要でクライアントは自分自身の移動イベントはサーバーを介さずに実行しているため、Broadcastから除外する
        this.broadcast(message, { except: client })
        break
      default:
        this.broadcast(message)
    }
  }

  private formatPlayerStatus = (client: Client) =>
    `id:${client.sessionId}, index:${Get(this.state.players, client.sessionId).index}`
}
