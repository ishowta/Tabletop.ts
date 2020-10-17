import _ from 'lodash'
import { Game } from './game'
import { Card } from '../Components/card'
import Tabletop from '../tabletop'
import { Component } from '../Components/component'

export class Trump extends Game {
  init(scene: Tabletop): Component[] {
    return [
      ..._.range(0, 14).flatMap((i) =>
        ['♥', '♠', '♦', '♣'].map(
          (type, j) =>
            new Card(scene, i * 4 + j, 500, 500, `${type}${i}`, 0x00ff00)
        )
      ),
    ]
  }
}
