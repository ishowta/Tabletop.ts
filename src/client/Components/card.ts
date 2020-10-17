import { GameObjects } from 'phaser'
import { Component } from './component'
import Tabletop from '../tabletop'

export class Card extends Component {
  private base: GameObjects.Rectangle
  private text: GameObjects.Text
  private back: GameObjects.Rectangle
  constructor(
    scene: Tabletop,
    index: number,
    x: number,
    y: number,
    text: string,
    color: number,
    isReversed = false
  ) {
    super(scene, index, x, y, 70, 120)
    this.base = scene.add.rectangle(0, 0, 70, 120, color)
    this.text = scene.add.text(-25, -16, text, {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#000000',
    })
    this.back = scene.add.rectangle(0, 0, 70, 120, 0x000000)
    this.back.visible = isReversed
    this.obj.add([this.base, this.text, this.back])
  }
  /**
   * Flip
   */
  rightClick(): void {
    this.back.visible = !this.back.visible
  }
}
