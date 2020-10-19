import { Game } from './game'
import { Card } from '../Components/card'
import { Component } from '../Components/component'
import _ from 'lodash'

export class Trump extends Game {
  create = (): Component[] => {
    let cards = this.buildTrump()
    cards = this.scene._.shuffle(cards)
    this.distribute(cards)
    return cards
  }
  buildTrump = (): Card[] => [
    ..._.range(0, 13).flatMap(i =>
      ['♥', '♠', '♦', '♣'].map(
        type =>
          new Card({
            scene: this.scene,
            text: `${type}${i + 1}`,
            color: 0xeeeeee,
            fontColor: ['♥', '♦'].includes(type) ? '#f00' : '#000',
          })
      )
    ),
    ..._.range(0, 2).map(
      _ =>
        new Card({
          scene: this.scene,
          text: `🃏`,
          color: 0xeeeeee,
          fontColor: '#000',
          fontSize: 50,
        })
    ),
  ]
}
