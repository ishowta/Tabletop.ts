import { Component } from './component'
import Tabletop from '../gamescene'
import { GameObjects } from 'phaser'

export class Dice extends Component {
  static SIZE = 30
  static FONT_SIZE = 17
  private text: GameObjects.Text
  constructor({
    scene,
    scale = 1.0,
    x = 0,
    y = 0,
    index = null,
  }: {
    scene: Tabletop
    scale?: number
    x?: number
    y?: number
    index?: number | null
  }) {
    super({
      scene,
      width: Dice.SIZE * 2 * scale,
      height: Dice.SIZE * 2 * scale,
      x: x,
      y: y,
      index: index,
      canTouch: true,
    })
    const base = scene.add.rectangle(0, 0, Dice.SIZE * scale, Dice.SIZE * scale, 0xeeeeee)
    this.text = scene.add.text(-Dice.FONT_SIZE / 4, -Dice.FONT_SIZE / 2, '１', {
      fontFamily: 'Arial',
      fontSize: Dice.FONT_SIZE,
      color: '#000',
      metrics: this.getFontMetrics('Arial', Dice.FONT_SIZE),
    })
    this.obj.add([base, this.text])
  }
  /** Throw dice */
  click(): void {
    this.text.text = ['１', '２', '３', '４', '５', '６'][this.scene._.random(0, 5)]
  }
}
