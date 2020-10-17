import 'phaser'
import { Room } from 'colyseus.js'
import { Component } from './Components/component'
import { Message } from '../message'
import { State } from '../schema'
import { GAME_LIST } from './Games/gameList'
import { Game } from './Games/game'
import { TabletopTs } from '.'

export default class Tabletop extends Phaser.Scene {
  private room: Room<State> | null = null
  private components: Component[] = []

  constructor() {
    super('tabletop')
  }

  preload(): void {}

  create(): void {
    this.add
      .text(100, 100, 'Trump', { fill: '#0f0' })
      .setInteractive()
      .on('pointerdown', () => {
        this.send({
          type: 'init',
          game: 'trump',
        })
      })

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const g = this.game as TabletopTs
    g.server
      .joinOrCreate<State>('game')
      .then((_room: Room) => {
        this.room = _room
        console.log(this.room.sessionId, 'joined', this.room.name)

        this.room.onMessage(this.processingMessage)
      })
      .catch((e) => {
        console.log("Error: Can't join server.", e)
      })
  }

  processingMessage = (message: Message): void => {
    // console.log("Process", message);
    switch (message.type) {
      case 'init': {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const game: Game = new GAME_LIST[message.game]()
        this.components = game.init(this)
        break
      }
      case 'move':
        this.components[message.index].move(message.x, message.y)
        break
      case 'leftClick':
        this.components[message.index].leftClick()
        break
      case 'rightClick':
        this.components[message.index].rightClick()
        break
    }
  }

  send(message: Message): void {
    // console.log("Send", message);
    this.room?.send(message)
    this.processingMessage(message)
  }
}
