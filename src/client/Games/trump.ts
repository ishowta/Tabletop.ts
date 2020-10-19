import { Game } from './game'
import { Card } from '../Components/card'
import { Component } from '../Components/component'
import _ from 'lodash'

export class Trump extends Game {
  create(): Component[] {
    let cards = this.buildTrump()
    cards = this.scene._.shuffle(cards)
    this.distribute(cards)
    return cards
  }
  buildTrump(): Card[] {
    return [
      ..._.range(0, 13).flatMap((i) =>
        ['♥', '♠', '♦', '♣'].map(
          (type) =>
            new Card(
              this.scene,
              `${type}${i + 1}`,
              0xeeeeee,
              false,
              ['♥', '♦'].includes(type) ? '#f00' : '#000'
            )
        )
      ),
      ..._.range(0, 2).map(
        (_) => new Card(this.scene, `🃏`, 0xeeeeee, false, '#000', 50)
      ),
    ]
  }
}
