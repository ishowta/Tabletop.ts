import { GameObjects } from 'phaser'
import Tabletop from '../tabletop'

export abstract class Component {
  x: number
  y: number
  obj: GameObjects.Container
  constructor(
    scene: Tabletop,
    index: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.x = x
    this.y = y
    this.obj = scene.add.container(x, y)
    this.obj.setSize(width, height)
    this.obj.setInteractive()
    scene.input.setDraggable(this.obj)
    this.obj.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        scene.send({
          type: 'move',
          index: index,
          x: dragX,
          y: dragY,
        })
      }
    )
  }
  move(x: number, y: number): void {
    this.obj.setPosition(x, y)
  }
  leftClick(): void {}
  rightClick(): void {}
}
