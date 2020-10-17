import { Component } from '../Components/component'
import Tabletop from '../tabletop'

export abstract class Game {
  abstract init(scene: Tabletop): Component[]
}
