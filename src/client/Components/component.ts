import { GameObjects } from 'phaser'
import Tabletop from '../gamescene'
import { Get, GetAll } from '../../schema'
import { MASK_SHAPE_LIST } from '../../const'

export abstract class Component {
  protected game: Tabletop
  obj: GameObjects.Container
  index: number | null
  canTouch: boolean
  private inPointerDown = false
  constructor(game: Tabletop, width: number, height: number, x = 0, y = 0, index: number | null = -1, canTouch = true) {
    this.canTouch = canTouch
    this.game = game
    this.index = index
    this.obj = game.add.container(x, y)
    this.obj.depth = 50
    this.obj.setSize(width, height)
    this.obj.setInteractive({ draggable: true })
    this.obj.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      if (!this.canTouch) return
      if (this.index == null) throw new Error('Components index is not set.')
      this.inPointerDown = false

      if (!this.checkTouchValidArea(game, pointer.x, pointer.y)) {
        this.game.input.setDragState(pointer, 0)
        return
      }

      game.send({
        type: 'moveComponent',
        index: this.index,
        x: dragX,
        y: dragY,
      })
    })
    this.obj.on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
      this.inPointerDown = true
    })
    this.obj.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.inPointerDown === false) return
      this.inPointerDown = false
      if (!this.canTouch) return
      if (this.index == null) throw new Error('Components index is not set.')
      if (!this.checkTouchValidArea(game, pointer.x, pointer.y)) return
      game.send({
        type: 'clickComponent',
        index: this.index,
      })
    })
  }
  move(x: number, y: number): void {
    this.obj.setPosition(x, y)
  }
  click(): void {}
  private checkTouchValidArea(game: Tabletop, x: number, y: number): boolean {
    // 他人のエリアは動かせないようにしたい
    /*
    相手の位置をとってきて動かせない範囲を決める
    */
    let players = GetAll(game.room.state.players)

    for (let player of players) {
      if (player.index !== Get(game.room.state.players, game.room.sessionId).index) {
        let [maskX, maskY, maskWidth, maskHeight] = MASK_SHAPE_LIST[player.index]
        if (maskX < x && x < maskX + maskWidth && maskY < y && y < maskY + maskHeight) {
          // 他人の手札の中にいるのでダメ！
          return false
        }
      }
    }
    return true
  }
}
