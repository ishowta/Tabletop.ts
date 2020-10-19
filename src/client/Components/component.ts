import { GameObjects } from 'phaser'
import Tabletop from '../gamescene'

export abstract class Component {
  x: number
  y: number
  obj: GameObjects.Container
  index: number | null
  private inPointerDown = false
  constructor(
    scene: Tabletop,
    width: number,
    height: number,
    x = 0,
    y = 0,
    index: number | null = -1
  ) {
    this.x = x
    this.y = y
    this.index = index
    this.obj = scene.add.container(x, y)
    this.obj.depth = 50
    this.obj.setSize(width, height)
    this.obj.setInteractive()
    scene.input.setDraggable(this.obj)
    this.obj.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (this.index == null) throw new Error('Components index is not set.')
        this.inPointerDown = false
        scene.send({
          type: 'moveComponent',
          index: this.index,
          x: dragX,
          y: dragY,
        })
      }
    )
    this.obj.on('pointerdown', () => {
      this.inPointerDown = true
    })
    this.obj.on('pointerup', () => {
      if (this.index == null) throw new Error('Components index is not set.')
      if (this.inPointerDown === false) return
      this.inPointerDown = false
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
}
