import 'phaser'
import * as Colyseus from 'colyseus.js'
import Tabletop from './tabletop'
import { WIDTH, HEIGHT } from './const'

const port = Number(process.env.PORT)

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
  public server: Colyseus.Client

  public constructor(conf: Phaser.Types.Core.GameConfig) {
    super(conf)
    this.server = new Colyseus.Client(`ws://localhost:${port}`)
  }
}

new TabletopTs(config)
