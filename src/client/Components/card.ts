import { GameObjects } from 'phaser'
import { Component } from './component'
import Tabletop from '../gamescene'

export class Card extends Component {
  WIDTH = 50
  HEIGHT = 80
  private text: GameObjects.Text
  private back: GameObjects.Rectangle
  private static fontMetrics: Record<string, Phaser.Types.GameObjects.Text.TextMetrics> = {}
  constructor({
    scene,
    text = '',
    scale = 1.0,
    color = 0x111,
    backColor = 0xcb904d,
    isReversed = false,
    fontColor = '#000000',
    fontSize = 27,
    x = 0,
    y = 0,
    index = null,
    canTouch = true,
    fontFamily = 'Arial',
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
    fontFamily?: string
  }) {
    super({ scene, width: 50, height: 80, x: x, y: y, index: index, canTouch: canTouch })
    const metricsKey = fontFamily + fontSize.toString()
    if (Card.fontMetrics[metricsKey] === undefined) {
      Card.fontMetrics[metricsKey] = scene.add
        .text(0, 0, '🃏', {
          fontFamily: fontFamily,
          fontSize: fontSize,
        })
        .setVisible(false)
        .getTextMetrics()
    }
    const base = scene.add.rectangle(0, 0, this.WIDTH * scale, this.HEIGHT * scale, color)
    this.text = scene.add.text((-fontSize * text.length) / 4, -fontSize / 2, text, {
      fontFamily: fontFamily,
      fontSize: fontSize,
      color: fontColor,
      metrics: Card.fontMetrics[metricsKey],
    })
    this.back = scene.add.rectangle(0, 0, this.WIDTH * scale, this.HEIGHT * scale, backColor)
    this.back.visible = isReversed
    this.obj.add([base, this.text, this.back])
  }
  /**
   * Flip
   */
  click(): void {
    this.back.visible = !this.back.visible
  }
}
