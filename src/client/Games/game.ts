import { Component } from '../Components/component'
import Tabletop from '../tabletop'
import { Room } from 'colyseus.js'
import { State, Player } from '../../schema'

export abstract class Game {
  protected scene: Tabletop
  protected room: Room<State>
  constructor(scene: Tabletop, room: Room<State>) {
    this.scene = scene
    this.room = room
  }
  /**
   * ゲームを初期化する
   * @param scene ゲームを起動するシーン
   */
  abstract init(): Component[]
  /**
   * コンポーネントを並べる
   * @param scene 並べるシーン
   * @param spot 並べる場所
   * @param components 並べるコンポーネントのリスト
   */
  protected place(
    spot: { type: 'hand'; index: number } | { type: 'board' },
    components: Component[]
  ) {
    const [spotX, spotY, spotWidth, spotHeight] =
      spot.type === 'hand' ? this.scene.MASK[spot.index] : this.scene.BOARD

    // 左上から整列させる。入り切らない場合は重ねる
    const cur = { x: spotX, y: spotY }
    let eachMaxHeight = 0
    const margin = 5
    for (const c of components) {
      if (cur.x + c.obj.width > spotX + spotWidth) {
        cur.x = spotX
        cur.y += eachMaxHeight + margin
      }
      if (cur.y + c.obj.height > spotY + spotHeight) {
        cur.x = spotX
        cur.y = spotY
        eachMaxHeight = 0
      }
      eachMaxHeight = Math.max(eachMaxHeight, c.obj.height)
      c.obj.setPosition(cur.x + c.obj.width / 2, cur.y + c.obj.height / 2)
      cur.x += c.obj.width + margin
    }
  }
  protected distribute(components: Component[]) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    let indexes = (Object.values(this.room.state.players) as Player[]).map(
      (p) => p.index
    )
    let hands = this.scene._.chunk(
      components,
      Math.floor(components.length / this.room.state.count)
    )
    console.log(hands)
    if (hands.length > this.room.state.count) {
      const key = this.scene._.random(0, this.room.state.count - 1)
      hands[key] = hands[key].concat(hands[hands.length - 1])
      hands.pop()
    }
    console.log(hands)
    this.scene._.zip(hands, indexes).forEach(([hand, index]) => {
      if (hand !== undefined && index !== undefined)
        this.place({ type: 'hand', index: index }, hand)
    })
  }
}
