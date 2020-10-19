import 'phaser'
import seedrandom from 'seedrandom'
import { Room } from 'colyseus.js'
import { Component } from './Components/component'
import { Event } from '../event'
import { State, Player, Get } from '../schema'
import { GAME_LIST, GAME_TYPE_LIST } from './Games/gameList'
import { Game } from './Games/game'
import { TabletopTs } from '.'
import { MASK_SHAPE_LIST, BOARD_SHAPE } from '../const'
import _, { LoDashStatic } from 'lodash'

export default class Tabletop extends Phaser.Scene {
  name: string
  room: Room<State> | null = null
  gameComponents: Component[] = []
  cursors: Record<string, Phaser.GameObjects.Container | null> = {}
  mask: Record<string, Phaser.GameObjects.Container> = {}
  initFinished = false
  _: LoDashStatic = _

  constructor() {
    super('tabletop')
    const urlParams = new URLSearchParams(window.location.search)
    const name = urlParams.get('name')
    this.name = name == null ? 'User' : name
    document.body.style.cursor = 'none'
  }

  preload(): void {}

  create(): void {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ;(this.game as TabletopTs).client
      .joinOrCreate<State>('game')
      .then((room: Room<State>) => {
        // 環境設定
        this.room = room
        seedrandom(room.id, { global: true })
        this._ = _.runInContext()

        console.log(room.sessionId, 'joined')

        room.send({ type: 'initUser', name: this.name, index: null })

        // イベントリスナーの設定
        room.onMessage(this.processingMessage)
        room.state.players.onAdd = (player: Player, sessionId: string) => {
          // Player doesnt init
          if (player.name === '') return
          this.processingMessage({
            type: 'initUser',
            id: sessionId,
            name: player.name,
            index: player.index,
          })
        }
        room.state.players.onRemove = (player: Player, sessionId: string) => {
          this.mask[sessionId].removeAll()
          this.mask[sessionId].destroy()
          delete this.mask[sessionId]
          this.cursors[sessionId]?.removeAll()
          this.cursors[sessionId]?.destroy()
          delete this.cursors[sessionId]
        }
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
          if (this.initFinished === false) return
          this.send({
            type: 'moveCursor' as const,
            id: room.sessionId,
            x: pointer.x,
            y: pointer.y,
          })
        })

        // ゲームリストの生成
        GAME_TYPE_LIST.forEach((gameName, i) => {
          this.add
            .text(BOARD_SHAPE[0] + 50 + i * 200, BOARD_SHAPE[1], gameName, {
              fontFamily: 'Arial',
              fill: '#000',
              fontSize: 60,
            })
            .setInteractive()
            .on('pointerdown', () => {
              this.send({
                type: 'initGame',
                game: gameName,
                seed: undefined,
              })
            })
            .setDepth(100)
        })
      })
      .catch((e) => {
        console.log("Error: Can't join server.", e)
      })
  }

  processingMessage = (message: Event): void => {
    if (this.room == null) {
      console.error('イベントが発生しましたが部屋が見つかりません')
      return
    }
    // console.log('Process', message)
    switch (message.type) {
      case 'initUser': {
        if (this.mask[message.id] == null) {
          // 手札を隠すマスクの生成
          const [x, y, width, height] = MASK_SHAPE_LIST[message.index]
          const mask = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0xdfcc74,
            message.id === this.room.sessionId ? 0.3 : 1.0
          )
          const userName = this.add.text(
            width / 2 - 80,
            height / 2 - 16,
            message.id === this.room.sessionId ? this.name : message.name,
            {
              fontFamily: 'Arial',
              fontSize: 32,
              color: '#000000',
            }
          )
          this.mask[message.id] = this.add
            .container(x, y, [mask, userName])
            .setDepth(75)
        }
        this.initFinished = true
        break
      }
      case 'moveCursor':
        if (this.cursors[message.id] == null) {
          const cur = this.add.text(0, 0, '👆', {
            fontFamily: 'Arial',
            fontSize: 50,
            color: '#000000',
          })
          const curName = this.add.text(
            50,
            20,
            Get(this.room.state.players, message.id).name,
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
      case 'initGame': {
        seedrandom(message.seed, { global: true })
        this._ = _.runInContext()

        // Reset prev game
        this.gameComponents.forEach((c) => {
          c.obj.removeAll()
          c.obj.destroy()
        })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const game: Game = new GAME_LIST[message.game](this, this.room)
        this.gameComponents = game.init()
        break
      }
      case 'moveComponent':
        this.gameComponents[message.index].move(message.x, message.y)
        break
      case 'clickComponent':
        this.gameComponents[message.index].click()
        break
    }
  }

  send(message: Event): void {
    // console.log('Send', message)
    switch (message.type) {
      case 'moveCursor':
      case 'moveComponent':
        this.processingMessage(message)
        break
      default:
    }

    this.room?.send(message)
  }
}
