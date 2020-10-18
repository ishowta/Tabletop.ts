import 'phaser'
import seedrandom from 'seedrandom'
import { Room } from 'colyseus.js'
import { Component } from './Components/component'
import { Message } from '../message'
import { State, Player } from '../schema'
import { GAME_LIST, GameType } from './Games/gameList'
import { Game } from './Games/game'
import { TabletopTs } from '.'
import { HEIGHT, WIDTH } from './const'
import _, { LoDashStatic } from 'lodash'

export default class Tabletop extends Phaser.Scene {
  room: Room<State> | null = null
  components: Component[] = []
  name: string
  cursors: Record<string, Phaser.GameObjects.Container | null> = {}
  userNameLabel: Phaser.GameObjects.Text | null = null
  mask: Record<string, Phaser.GameObjects.Container> = {}
  _: LoDashStatic = _
  MASK = [
    [(WIDTH / 6) * 0, (HEIGHT / 6) * 0, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
    [(WIDTH / 6) * 5, (HEIGHT / 6) * 0, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
    [(WIDTH / 6) * 0, (HEIGHT / 6) * 2, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
    [(WIDTH / 6) * 5, (HEIGHT / 6) * 2, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
    [(WIDTH / 6) * 0, (HEIGHT / 6) * 4, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
    [(WIDTH / 6) * 5, (HEIGHT / 6) * 4, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
    [(WIDTH / 6) * 1, (HEIGHT / 6) * 0, (WIDTH / 6) * 2, (HEIGHT / 6) * 1],
    [(WIDTH / 6) * 3, (HEIGHT / 6) * 0, (WIDTH / 6) * 2, (HEIGHT / 6) * 1],
    [(WIDTH / 6) * 1, (HEIGHT / 6) * 5, (WIDTH / 6) * 2, (HEIGHT / 6) * 1],
    [(WIDTH / 6) * 3, (HEIGHT / 6) * 5, (WIDTH / 6) * 2, (HEIGHT / 6) * 1],
  ]
  BOARD = [(WIDTH / 6) * 1, (HEIGHT / 6) * 1, (WIDTH / 6) * 5, (HEIGHT / 6) * 5]

  constructor() {
    super('tabletop')
    const urlParams = new URLSearchParams(window.location.search)
    const name = urlParams.get('name')
    this.name = name == null ? 'Player' : name
  }

  preload(): void {}

  create(): void {
    document.body.style.cursor = 'none'
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const g = this.game as TabletopTs
    g.server
      .joinOrCreate<State>('game')
      .then((room: Room<State>) => {
        this.room = room
        seedrandom(room.id, { global: true })
        this._ = _.runInContext()
        console.log(room.sessionId, 'joined', room.name)

        // 名前を送る
        room.send({ type: 'name', name: this.name })

        room.onMessage(this.processingMessage)
        room.state.players.onAdd = (player: Player, sessionId: string) => {
          // Make hand mask
          const [x, y, width, height] = this.MASK[player.index]
          const mask = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0xdfcc74,
            sessionId === room.sessionId ? 0.3 : 1.0
          )
          const userName = this.add.text(
            width / 2 - 80,
            height / 2 - 16,
            'Player',
            {
              fontFamily: 'Arial',
              fontSize: 32,
              color: '#000000',
            }
          )
          this.userNameLabel = userName
          this.mask[sessionId] = this.add
            .container(x, y, [mask, userName])
            .setDepth(75)
          if (this.userNameLabel != null) {
            this.userNameLabel.text =
              sessionId === room.sessionId ? this.name : player.name
          }
        }
        room.state.players.onChange = (player: Player, sessionId: string) => {
          if (this.userNameLabel != null) {
            this.userNameLabel.text =
              sessionId === room.sessionId ? this.name : player.name
          }
        }
        room.state.players.onRemove = (player: Player, sessionId: string) => {
          console.log('onremove', sessionId)
          // Remove hand mask
          this.mask[sessionId].removeAll()
          delete this.mask[sessionId]
        }

        // cursor
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
          const mes = {
            type: 'cursor' as const,
            id: room.sessionId,
            x: pointer.x,
            y: pointer.y,
          }
          this.processingMessage(mes)
          room.send(mes)
        })

        this.waitServer()
      })
      .catch((e) => {
        console.log("Error: Can't join server.", e)
      })
  }

  waitServer() {
    setTimeout(() => {
      const room = this.room
      if (
        room == null ||
        this.room?.state.players[this.room.sessionId] === undefined
      ) {
        this.waitServer()
      } else {
        this.createTabletop(room)
      }
    }, 100)
  }

  createTabletop(_room: Room<State>): void {
    // Make game start button
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const keys: Array<GameType> = Object.keys(GAME_LIST) as Array<GameType>
    keys.forEach((gameName, i) => {
      this.add
        .text(i * 200 + 800, 0, gameName, {
          fontFamily: 'Arial',
          fill: '#000',
          fontSize: 60,
        })
        .setInteractive()
        .on('pointerdown', () => {
          this.send({
            type: 'init',
            game: gameName,
          })
        })
        .setDepth(100)
    })
  }

  processingMessage = (message: Message): void => {
    // console.log('Process', message)
    switch (message.type) {
      case 'name':
        break
      case 'cursor':
        if (this.cursors[message.id] == null) {
          const cur = this.add.text(0, 0, '👆', {
            fontFamily: 'Arial',
            fontSize: 50,
            color: '#000000',
          })
          // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access
          const curName = this.add.text(
            50,
            20,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            this.room?.state.players[message.id].name,
            {
              fontFamily: 'Arial',
              fontSize: 33,
              color: '#000000',
            }
          )
          this.cursors[message.id] = this.add
            .container(0, 0, [cur, curName])
            .setDepth(200)
        }
        this.cursors[message.id]?.setPosition(message.x - 25, message.y)
        break
      case 'init': {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any
        seedrandom((message as any).rs, { global: true })
        this._ = _.runInContext()
        // Reset prev game
        this.components.forEach((c) => {
          c.obj.removeAll()
          c.obj.destroy()
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const game: Game = new GAME_LIST[message.game](this, this.room)
        this.components = game.init()
        break
      }
      case 'move':
        this.components[message.index].move(message.x, message.y)
        break
      case 'click':
        this.components[message.index].click()
        break
    }
  }

  send(message: Message): void {
    console.log('Send', message)
    this.room?.send(message)
    if (message.type === 'move') this.processingMessage(message)
  }
}
