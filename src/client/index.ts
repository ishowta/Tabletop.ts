import 'phaser'
import * as Colyseus from 'colyseus.js'
import Tabletop from './tabletop'

const port = Number(process.env.PORT)

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  width: 1920,
  height: 1080,
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
