import 'phaser'
import * as Colyseus from 'colyseus.js'
import Tabletop from './gamescene'
import { WIDTH, HEIGHT } from '../const'

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#207720',
  width: WIDTH,
  height: HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: Tabletop,
}

export class TabletopTs extends Phaser.Game {
  public client: Colyseus.Client
  public constructor(conf: Phaser.Types.Core.GameConfig) {
    super(conf)
    this.client = new Colyseus.Client(process.env.SERVER_ADDRESS)
  }
}

new TabletopTs(config)
