import { Game } from './game'
import { Card } from '../Components/card'
import { Component } from '../Components/component'
import _ from 'lodash'
import { Chip } from '../Components/chip'
import { GameObjects } from 'phaser'
import { Dice } from '../Components/dice'

export class Katan extends Game {
  create(): Component[] {
    // 設定
    const USER_COUNT = Object.keys(this.room.state.players).length
    const MATERIAL_LIST = ['wood', 'wheat', 'sheep', 'brick', 'stone'] as const
    type materialType = typeof MATERIAL_LIST[number]
    const MATERIAL_TYPE: Record<materialType | 'mountain', number[]> = {
      wood: [0x466c2b, 4, 20],
      wheat: [0xf7c84c, 4, 20],
      sheep: [0x89b32f, 4, 20],
      brick: [0xad6227, 3, 20],
      stone: [0xb9a9af, 3, 20],
      mountain: [0x463537, 1, 0],
    }
    const CHANCECARD_TYPE: [string, number][] = [
      ['騎士', 14],
      ['ポイント', 5],
      ['独占', 2],
      ['発見', 2],
      ['街道建設', 2],
    ]
    const ACHIEVE_TYPE = ['最大騎士力', '最長街道']
    const NUMBERCHIP_TYPE = [
      [2, 1],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
      [7, 2],
      [8, 2],
      [9, 2],
      [10, 2],
      [11, 2],
      [12, 1],
    ]
    const ROAD_NUM = 15
    const VILLAGE_NUM = 5
    const CITY_NUM = 4
    const PLAYER_COLOR = [0x000000, 0xff0000, 0x00ff00, 0x0000ff]
    const HARBOR_TYPE: [string, number][] = [
      ['３：１', 4],
      ['２：１（煉瓦）', 1],
      ['２：１（木）', 1],
      ['２：１（羊）', 1],
      ['２：１（麦）', 1],
      ['２：１（岩）', 1],
    ]

    // 生成
    let fields = Object.entries(MATERIAL_TYPE).flatMap(([_matType, [color, num, _cnum]]) =>
      _.range(0, num).map(_ =>
        Component.Build(
          this.scene,
          new GameObjects.Polygon(
            this.scene,
            0,
            0,
            [0, 0, 1, 1, 1, 2, 0, 3, -1, 2, -1, 1].map(x => x * 50),
            color
          )
        )
      )
    )

    let numberChips = NUMBERCHIP_TYPE.flatMap(([i, num]) =>
      _.range(0, num).map(
        _ =>
          new Chip({
            scene: this.scene,
            text: i.toString(),
            color: 0xeeeeee,
            fontColor: i === 6 || i === 8 ? '#f00' : '#000',
          })
      )
    )
    let dices = _.range(0, 2).map(_ => new Dice({ scene: this.scene }))
    let pieces = _.range(0, USER_COUNT).map(i => [
      ..._.range(0, ROAD_NUM).map(_ =>
        Component.Build(this.scene, new GameObjects.Rectangle(this.scene, 0, 0, 50, 25, PLAYER_COLOR[i]))
      ),
      ..._.range(0, VILLAGE_NUM).map(_ =>
        Component.Build(this.scene, new GameObjects.Rectangle(this.scene, 0, 0, 25, 25, PLAYER_COLOR[i]))
      ),
      ..._.range(0, CITY_NUM).map(_ =>
        Component.Build(this.scene, new GameObjects.Ellipse(this.scene, 0, 0, 50, 50, PLAYER_COLOR[i]))
      ),
    ])
    let harbors = HARBOR_TYPE.flatMap(([text, num]) =>
      _.range(0, num).map(_ => Component.Build(this.scene, new GameObjects.Text(this.scene, 0, 0, text, {})))
    )
    let materialCards = Object.entries(MATERIAL_TYPE).map(([_matType, [color, _num, cnum]]) =>
      _.range(0, cnum).map(_ => new Card({ scene: this.scene, color }))
    )
    let chanceCards = CHANCECARD_TYPE.flatMap(([text, num]) =>
      _.range(0, num).map(_ => new Card({ scene: this.scene, text, color: 0xeeeeee, isReversed: true }))
    )
    let achieves = ACHIEVE_TYPE.map(text => new Card({ scene: this.scene, text, color: 0xeeeeee }))
    let thief = Component.Build(
      this.scene,
      new GameObjects.Text(this.scene, 0, 0, '盗賊', { fontSize: '30', color: '#111' })
    )

    // シャッフル
    fields = this.scene._.shuffle(fields)
    numberChips = this.scene._.shuffle(numberChips)
    harbors = this.scene._.shuffle(harbors)
    chanceCards = this.scene._.shuffle(chanceCards)

    // 配置
    _.range(0, USER_COUNT).map((index, i) => this.place({ type: 'hand', index }, pieces[i]))
    this.place({ type: 'board' }, [
      ...dices,
      ...achieves,
      thief,
      ...materialCards,
      chanceCards,
      fields,
      numberChips,
      harbors,
    ])

    return [
      ...fields,
      ...numberChips,
      ...dices,
      ..._.flatten(pieces),
      ...harbors,
      ..._.flatten(materialCards),
      ...chanceCards,
      ...achieves,
      thief,
    ]
  }
}
