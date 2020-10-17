import express from 'express'
import path from 'path'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import watch from 'node-watch'
import { exec } from 'child_process'
import { GameRoom } from './server/gameroom'
const port = Number(process.env.PORT)
const isDev = process.env.NODE_ENV === 'development'
const app = express()
const STATIC_PATH = isDev ? '../static' : './static'
const DEV_STATIC_BUILD_COMMAND =
  'yarn esbuild ./src/client/index.ts --bundle --platform=browser --define:process.env.PORT=8571 --outfile=./static/_dist_/dev.js'

app.use(cors())
app.use(express.json())

const gameServer = new Server({
  server: createServer(app),
  express: app,
  pingInterval: 0,
})

gameServer.define('game', GameRoom)
app.use('/', express.static(path.join(__dirname, STATIC_PATH)))
if (isDev) app.use('/colyseus', monitor())

if (isDev) {
  const build = () => {
    exec(DEV_STATIC_BUILD_COMMAND, (e, so, se) => {
      if (e != null) {
        console.log(`error: ${e.message}`)
        return
      }
      if (se) {
        console.log(`stderr: ${se}`)
        return
      }
    })
  }
  build()
  watch('./src/client', { recursive: true }, function (evt, name) {
    console.log('%s changed.', name)
    build()
  })
}

gameServer.onShutdown(function () {
  console.log(`game server is going down.`)
})
gameServer
  .listen(port)
  .then(() => {
    console.log(`Listening on http://localhost:${port}`)
  })
  .catch(() => {
    console.log(`Cannot listen port ${port}`)
  })
