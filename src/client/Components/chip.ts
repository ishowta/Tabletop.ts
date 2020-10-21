import { Component } from './component'
import Tabletop from '../gamescene'

export class Chip extends Component {
  static SIZE = 15
  constructor({
    scene,
    text = '',
    scale = 1.0,
    color = 0x111,
    fontColor = '#000000',
    fontSize = 15,
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
    fontColor?: string
    fontSize?: number
    x?: number
    y?: number
    index?: number | null
    canTouch?: boolean
    fontFamily?: string
  }) {
    super({
      scene,
      width: Chip.SIZE * 2 * scale,
      height: Chip.SIZE * 2 * scale,
      x: x,
      y: y,
      index: index,
      canTouch: canTouch,
    })
    const baseObj = scene.add.circle(0, 0, Chip.SIZE * scale, color)
    const textObj = scene.add.text((-fontSize * text.length) / 4, -fontSize / 2, text, {
      fontFamily: fontFamily,
      fontSize: fontSize,
      color: fontColor,
      metrics: this.getFontMetrics(fontFamily, fontSize),
    })
    this.obj.add([baseObj, textObj])
  }
  click(): void {}
}
