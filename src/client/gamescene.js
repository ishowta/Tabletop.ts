"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
const seedrandom_1 = __importDefault(require("seedrandom"));
const schema_1 = require("../schema");
const gameList_1 = require("./Games/gameList");
const const_1 = require("../const");
const lodash_1 = __importDefault(require("lodash"));
class Tabletop extends Phaser.Scene {
    constructor() {
        super('tabletop');
        this.gameComponents = [];
        this.cursors = {};
        this.mask = {};
        this.initFinished = false;
        this._ = lodash_1.default;
        this.processingMessage = (message) => {
            if (this.room == null) {
                console.error('イベントが発生しましたが部屋が見つかりません');
                return;
            }
            // console.log('Process', message)
            switch (message.type) {
                case 'initUser': {
                    if (this.mask[message.id] == null) {
                        // 手札を隠すマスクの生成
                        const [x, y, width, height] = const_1.MASK_SHAPE_LIST[message.index];
                        const mask = this.add.rectangle(width / 2, height / 2, width, height, 0xdfcc74, message.id === this.room.sessionId ? 0.3 : 1.0);
                        const userName = this.add.text(width / 2 - 80, height / 2 - 16, message.id === this.room.sessionId ? this.name : message.name, {
                            fontFamily: 'Arial',
                            fontSize: 32,
                            color: '#000000',
                        });
                        this.mask[message.id] = this.add.container(x, y, [mask, userName]).setDepth(75);
                    }
                    this.initFinished = true;
                    break;
                }
                case 'moveCursor':
                    if (this.cursors[message.id] == null) {
                        const cur = this.add.text(0, 0, '👆', {
                            fontFamily: 'Arial',
                            fontSize: 50,
                            color: '#000000',
                        });
                        const curName = this.add.text(50, 20, schema_1.Get(this.room.state.players, message.id).name, {
                            fontFamily: 'Arial',
                            fontSize: 33,
                            color: '#000000',
                        });
                        this.cursors[message.id] = this.add.container(0, 0, [cur, curName]).setDepth(200);
                    }
                    this.cursors[message.id]?.setPosition(message.x - 25, message.y);
                    break;
                case 'initGame': {
                    seedrandom_1.default(message.seed, { global: true });
                    this._ = lodash_1.default.runInContext();
                    // Reset prev game
                    this.gameComponents.forEach(c => {
                        c.obj.removeAll();
                        c.obj.destroy();
                    });
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
                    const game = new gameList_1.GAME_LIST[message.game](this, this.room);
                    this.gameComponents = game.init();
                    break;
                }
                case 'pointerDownComponent': {
                    const maxDepth = lodash_1.default.maxBy(this.gameComponents, c => c.obj.depth)?.obj.depth;
                    if (maxDepth != null)
                        this.gameComponents[message.index].obj.depth = maxDepth + 0.0001;
                    break;
                }
                case 'moveComponent':
                    this.gameComponents[message.index].move(message.x, message.y);
                    break;
                case 'clickComponent':
                    this.gameComponents[message.index].click();
                    break;
            }
        };
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        this.name = name == null ? 'User' : name;
        document.body.style.cursor = 'none';
    }
    preload() {
        this.load.image('background', '../assets/board.png');
    }
    create() {
        const CELL = const_1.WIDTH / 6 / 6;
        this.add
            .image(const_1.WIDTH / 6 - CELL * 2, (const_1.HEIGHT / 6) * 1 - CELL * 2, 'background')
            .setOrigin(0, 0)
            .setScale(1.5);
        this.game.client
            .joinOrCreate('game')
            .then((room) => {
            // 環境設定
            this.room = room;
            seedrandom_1.default(room.id, { global: true });
            this._ = lodash_1.default.runInContext();
            console.log(room.sessionId, 'joined');
            room.send({ type: 'initUser', name: this.name, index: null });
            // イベントリスナーの設定
            room.onMessage(this.processingMessage);
            room.state.players.onAdd = (player, sessionId) => {
                // Player doesnt init
                if (player.name === '')
                    return;
                this.processingMessage({
                    type: 'initUser',
                    id: sessionId,
                    name: player.name,
                    index: player.index,
                });
            };
            room.state.players.onRemove = (player, sessionId) => {
                this.mask[sessionId].removeAll();
                this.mask[sessionId].destroy();
                delete this.mask[sessionId];
                this.cursors[sessionId]?.removeAll();
                this.cursors[sessionId]?.destroy();
                delete this.cursors[sessionId];
            };
            this.input.on('pointermove', (pointer) => {
                if (this.initFinished === false)
                    return;
                this.send({
                    type: 'moveCursor',
                    id: room.sessionId,
                    x: pointer.x,
                    y: pointer.y,
                });
            });
            // ゲームリストの生成
            gameList_1.GAME_TYPE_LIST.forEach((gameName, i) => {
                this.add.rectangle(const_1.BOARD_SHAPE[0] + 50 + i * 150, const_1.BOARD_SHAPE[1], 130, 50, 0xeeeeee);
                this.add
                    .text(const_1.BOARD_SHAPE[0] + 50 + i * 150, const_1.BOARD_SHAPE[1], gameName, {
                    fontFamily: 'Arial',
                    fill: '#000',
                    fontSize: 30,
                })
                    .setOrigin(0.5, 0.5)
                    .setInteractive()
                    .on('pointerdown', () => {
                    this.send({
                        type: 'initGame',
                        game: gameName,
                        seed: undefined,
                    });
                })
                    .setDepth(100);
            });
        })
            .catch(e => {
            console.log("Error: Can't join server.", e);
        });
    }
    send(message) {
        // console.log('Send', message)
        switch (message.type) {
            case 'moveCursor':
            case 'pointerDownComponent':
            case 'moveComponent':
                this.processingMessage(message);
                break;
            default:
        }
        this.room?.send(message);
    }
}
exports.default = Tabletop;
