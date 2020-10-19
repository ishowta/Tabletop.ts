import { GameObjects } from 'phaser'
import { Component } from './component'
import Tabletop from '../gamescene'

export class Card extends Component {
  WIDTH = 50
  HEIGHT = 80
  private base: GameObjects.Rectangle
  private text: GameObjects.Text
  private back: GameObjects.Rectangle
  constructor({
    scene,
    text = '',
    scale = 1.0,
    color = 0x111,
    backColor = 0xcb904d,
    isReversed = false,
    fontColor = '#000000',
    fontSize = 29,
    x = 0,
    y = 0,
    index = null,
    canTouch = true,
  }: {
    scene: Tabletop
    text?: string
    scale?: number
    color?: number
    backColor?: number
    isReversed?: boolean
    fontColor?: string
    fontSize?: number
    x?: number
    y?: number
    index?: number | null
    canTouch?: boolean
  }) {
    super({ scene, width: 50, height: 80, x: x, y: y, index: index, canTouch: canTouch })
    this.base = scene.add.rectangle(0, 0, this.WIDTH * scale, this.HEIGHT * scale, color)
    this.text = scene.add.text(-23, -16, text, {
      fontFamily: 'Arial',
      fontSize: fontSize,
      color: fontColor,
    })
    this.back = scene.add.rectangle(0, 0, this.WIDTH * scale, this.HEIGHT * scale, backColor)
    this.back.visible = isReversed
    this.obj.add([this.base, this.text, this.back])
  }
  /**
   * Flip
   */
  click(): void {
    this.back.visible = !this.back.visible
  }
}
