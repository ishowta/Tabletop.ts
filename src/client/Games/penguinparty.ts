import { Component } from '../Components/component'
import { Game } from './game'
import _ from 'lodash'
import { Card } from '../Components/card'

export class PenguinParty extends Game {
  init(): Component[] {
    const colors = [0x7ca247, 0xfbe400, 0xe24c2d, 0x614f9e, 0x75c4ea]
    const cards = [
      ...colors.flatMap((color, i) =>
        _.range(0, 7).map(
          (j) => new Card(this.scene, i * 7 + j, 0, 0, '', color)
        )
      ),
      new Card(this.scene, 35, 0, 0, '', colors[0]),
    ]
    const shuffled = this.scene._.shuffle(cards)
    this.distribute(shuffled)
    return cards
  }
}
