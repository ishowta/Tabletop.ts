import { GameObjects } from 'phaser'
import { Component } from './component'
import Tabletop from '../gamescene'

export class Card extends Component {
  private base: GameObjects.Rectangle
  private text: GameObjects.Text
  private back: GameObjects.Rectangle
  constructor(
    scene: Tabletop,
    text: string,
    color: number,
    isReversed = false,
    fontColor = '#000000',
    fontSize = 29,
    x = 0,
    y = 0,
    index: number | null = null
  ) {
    super(scene, 50, 80, x, y, index)
    this.base = scene.add.rectangle(0, 0, 50, 80, color)
    this.text = scene.add.text(-23, -16, text, {
      fontFamily: 'Arial',
      fontSize: fontSize,
      color: fontColor,
    })
    this.back = scene.add.rectangle(0, 0, 50, 80, 0xcb904d)
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
