import { Component } from '../Components/component'
import { Game } from './game'
import { Card } from '../Components/card'

export class PenguinParty extends Game {
  create(): Component[] {
    const CARD_TYPE = [
      [0x7ca247, 8],
      [0xfbe400, 7],
      [0xe24c2d, 7],
      [0x614f9e, 7],
      [0x75c4ea, 7],
    ]
    let cards = []
    for (let [color, num] of CARD_TYPE) {
      for (let i = 0; i < num; ++i) {
        cards.push(new Card(this.scene, '', color))
      }
    }
    cards = this.scene._.shuffle(cards)
    this.distribute(cards)
    return cards
  }
}
