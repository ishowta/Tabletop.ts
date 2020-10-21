import { GameObjects } from 'phaser'
import Tabletop from '../gamescene'
import { Get, GetAll } from '../../schema'
import { MASK_SHAPE_LIST } from '../../const'

export abstract class Component {
  protected scene: Tabletop
  obj: GameObjects.Container
  index: number | null
  canTouch: boolean
  private inPointerDown = false
  private static fontMetrics: Record<string, Phaser.Types.GameObjects.Text.TextMetrics> = {}
  constructor({
    scene,
    width,
    height,
    x = 0,
    y = 0,
    index = null,
    canTouch = true,
  }: {
    scene: Tabletop
    width: number
    height: number
    x?: number
    y?: number
    index?: number | null
    canTouch?: boolean
  }) {
    this.canTouch = canTouch
    this.scene = scene
    this.index = index
    this.obj = scene.add.container(x, y)
    this.obj.depth = 50
    this.obj.setSize(width, height)
    this.obj.setInteractive({ draggable: true })
    this.obj.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      if (!this.canTouch) return
      if (this.index == null) throw new Error('Components index is not set.')
      this.inPointerDown = false

      if (!this.checkTouchValidArea(scene, pointer.x, pointer.y)) {
        this.scene.input.setDragState(pointer, 0)
        return
      }

      scene.send({
        type: 'moveComponent',
        index: this.index,
        x: dragX,
        y: dragY,
      })
    })
    this.obj.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.inPointerDown = true
      if (!this.canTouch) return
      if (this.index == null) throw new Error('Components index is not set.')
      scene.send({
        type: 'pointerDownComponent',
        index: this.index,
        x: pointer.x,
        y: pointer.y,
      })
    })
    this.obj.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.inPointerDown === false) return
      this.inPointerDown = false
      if (!this.canTouch) return
      if (this.index == null) throw new Error('Components index is not set.')
      if (!this.checkTouchValidArea(scene, pointer.x, pointer.y)) return
      scene.send({
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
  protected getFontMetrics(fontFamily: string, fontSize: number) {
    const metricsKey = fontFamily + fontSize.toString()
    if (Component.fontMetrics[metricsKey] === undefined) {
      Component.fontMetrics[metricsKey] = this.scene.add
        .text(0, 0, '', {
          fontFamily: fontFamily,
          fontSize: fontSize,
        })
        .setVisible(false)
        .getTextMetrics()
    }
    return Component.fontMetrics[metricsKey]
  }
}
