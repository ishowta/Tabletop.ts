import { Component } from '../Components/component'
import Tabletop from '../gamescene'
import { Room } from 'colyseus.js'
import { State, GetAll } from '../../schema'
import { MASK_SHAPE_LIST, BOARD_SHAPE } from '../../const'
import _ from 'lodash'

export abstract class Game {
  protected scene: Tabletop
  protected room: Room<State>
  constructor(scene: Tabletop, room: Room<State>) {
    this.scene = scene
    this.room = room
  }
  /**
   * ゲームを初期化する
   */
  init(): Component[] {
    let comps = this.create()

    // インデックスをセットする
    comps.forEach((comp, i) => (comp.index = i))

    return comps
  }
  /**
   * コンポーネントを生成する
   */
  abstract create(): Component[]

  // ヘルパー関数

  /**
   * コンポーネントを並べる
   * @param scene 並べるシーン
   * @param spot 並べる場所
   * @param components 並べるコンポーネントのリスト
   */
  protected place(spot: { type: 'hand'; index: number } | { type: 'board' }, components: (Component | Component[])[]) {
    const margin = 5
    let [spotX, spotY, spotWidth, spotHeight] =
      spot.type === 'hand' ? MASK_SHAPE_LIST[spot.index] : _.zipWith(BOARD_SHAPE, [0, 30, 0, 0], (a, b) => a + b)
    spotX += margin
    spotY += margin

    // 左上から整列させる。入り切らない場合は重ねる
    const cur = { x: spotX, y: spotY }
    let eachMaxHeight = 0

    for (const c of components) {
      if (c instanceof Array && c.length === 0) continue
      const width = c instanceof Array ? Math.max(...c.map(x => x.obj.width)) : c.obj.width
      const height = c instanceof Array ? Math.max(...c.map(x => x.obj.height)) : c.obj.height
      if (cur.x + width > spotX + spotWidth) {
        cur.x = spotX
        cur.y += eachMaxHeight + margin
      }
      if (cur.y + height > spotY + spotHeight) {
        cur.x = spotX
        cur.y = spotY
        eachMaxHeight = 0
      }
      eachMaxHeight = Math.max(eachMaxHeight, height)
      const cl = c instanceof Array ? c : [c]
      let dep = cl[0].obj.depth
      for (const comp of cl) {
        comp.obj.setPosition(cur.x + comp.obj.width / 2, cur.y + comp.obj.height / 2)
        comp.obj.depth = dep
        dep += 0.0001
      }
      cur.x += width + margin
    }
  }
  /**
   * コンポーネントを均等に配る
   * @param components 配るコンポーネント
   */
  protected distribute(components: Component[]) {
    let indexes = GetAll(this.room.state.players).map(p => p.index)
    const count = indexes.length
    let hands = _.chunk(components, Math.floor(components.length / count))
    if (hands.length > count) {
      const key = this.scene._.random(0, count - 1)
      hands[key] = hands[key].concat(hands[hands.length - 1])
      hands.pop()
    }
    _.zip(hands, indexes).forEach(([hand, index]) => {
      if (hand !== undefined && index !== undefined) this.place({ type: 'hand', index: index }, hand)
    })
  }
}
