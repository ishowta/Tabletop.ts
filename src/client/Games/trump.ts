import { Game } from './game'
import { Card } from '../Components/card'
import { Component } from '../Components/component'

export class Trump extends Game {
  init(): Component[] {
    const cards = this.buildTrump()
    const cardsShuffled = this.scene._.shuffle(cards)
    this.distribute(cardsShuffled)
    return cards
  }
  buildTrump(): Card[] {
    return [
      ...this.scene._.range(0, 13).flatMap((i) =>
        ['♥', '♠', '♦', '♣'].map(
          (type, j) =>
            new Card(
              this.scene,
              i * 4 + j,
              500,
              500,
              `${type}${i + 1}`,
              0xeeeeee,
              false,
              ['♥', '♦'].includes(type) ? '#f00' : '#000'
            )
        )
      ),
      new Card(this.scene, 52, 500, 500, `🃏`, 0xeeeeee, false, '#000', 50),
      new Card(this.scene, 53, 500, 500, `🃏`, 0xeeeeee, false, '#000', 50),
    ]
  }
}
