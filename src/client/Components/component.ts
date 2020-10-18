import { GameObjects } from 'phaser'
import Tabletop from '../tabletop'

export abstract class Component {
  x: number
  y: number
  obj: GameObjects.Container
  private inPointerDown = false
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
    this.obj.depth = 50
    this.obj.setSize(width, height)
    this.obj.setInteractive()
    scene.input.setDraggable(this.obj)
    this.obj.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        this.inPointerDown = false
        scene.send({
          type: 'move',
          index: index,
          x: dragX,
          y: dragY,
        })
      }
    )
    this.obj.on('pointerdown', () => {
      this.inPointerDown = true
    })
    this.obj.on('pointerup', () => {
      if (this.inPointerDown === false) return
      this.inPointerDown = false
      scene.send({
        type: 'click',
        index: index,
      })
    })
  }
  move(x: number, y: number): void {
    this.obj.setPosition(x, y)
  }
  click(): void {}
}
