import express from 'express'
import path from 'path'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import watch from 'node-watch'
import { exec } from 'child_process'
import { GameRoom } from './server/gameroom'
import dotenv from 'dotenv'

dotenv.config()
if (process.env.SERVER_ADDRESS === undefined || process.env.SERVER_PORT === undefined) throw new Error('.env not found')
const ADDRESS = process.env.SERVER_ADDRESS
const PORT = process.env.SERVER_PORT
const ISDEV = process.env.NODE_ENV === 'development'
const STATIC_PATH = '../static'
const STATIC_BUILD_COMMAND = `yarn esbuild ./src/client/index.ts --bundle --sourcemap --platform=browser --define:process.env=\\"${JSON.stringify(
  dotenv.config().parsed
)}\\" --outfile=./static/_dist_/dev.js`

const app = express()
app.use(cors())
app.use(express.json())

const gameServer = new Server({
  server: createServer(app),
  express: app,
})

gameServer.define('game', GameRoom)
app.use('/', express.static(path.join(__dirname, STATIC_PATH)))
if (ISDEV) app.use('/colyseus', monitor())
gameServer.onShutdown(function () {
  console.log(`game server is going down.`)
})
gameServer
  .listen(parseInt(PORT))
  .then(() => {
    console.log(`Listening on ${ADDRESS}`)
  })
  .catch(e => {
    console.log(`Cannot listen.`, e)
  })

const build = () => {
  exec(STATIC_BUILD_COMMAND, (error, _stdout, stderror) => {
    if (error != null) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderror) {
      console.log(`stderr: ${stderror}`)
      return
    }
  })
}
build()
if (ISDEV) {
  // Hot reload
  watch('./src', { recursive: true }, function (_evt, _name) {
    console.log(`${_name != null ? _name : ''} changed.`)
    build()
  })
}
