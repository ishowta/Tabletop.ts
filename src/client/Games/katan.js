"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Katan = void 0;
const game_1 = require("./game");
const card_1 = require("../Components/card");
const component_1 = require("../Components/component");
const lodash_1 = __importDefault(require("lodash"));
const chip_1 = require("../Components/chip");
const phaser_1 = require("phaser");
const dice_1 = require("../Components/dice");
class Katan extends game_1.Game {
    create() {
        // 設定
        const USER_COUNT = Object.keys(this.room.state.players).length;
        const MATERIAL_LIST = ['wood', 'wheat', 'sheep', 'brick', 'stone'];
        const MATERIAL_TYPE = {
            wood: [0x466c2b, 4, 20],
            wheat: [0xf7c84c, 4, 20],
            sheep: [0x89b32f, 4, 20],
            brick: [0xad6227, 3, 20],
            stone: [0xb9a9af, 3, 20],
            mountain: [0x463537, 1, 0],
        };
        const CHANCECARD_TYPE = [
            ['騎士', 14],
            ['ポイント', 5],
            ['独占', 2],
            ['発見', 2],
            ['街道建設', 2],
        ];
        const ACHIEVE_TYPE = ['最大騎士力', '最長街道'];
        const NUMBERCHIP_TYPE = [
            [2, 1],
            [3, 2],
            [4, 2],
            [5, 2],
            [6, 2],
            [7, 2],
            [8, 2],
            [9, 2],
            [10, 2],
            [11, 2],
            [12, 1],
        ];
        const ROAD_NUM = 15;
        const VILLAGE_NUM = 5;
        const CITY_NUM = 4;
        const PLAYER_COLOR = [0x000000, 0xff0000, 0x00ff00, 0x0000ff];
        const HARBOR_TYPE = [
            ['３：１', 4],
            ['２：１（煉瓦）', 1],
            ['２：１（木）', 1],
            ['２：１（羊）', 1],
            ['２：１（麦）', 1],
            ['２：１（岩）', 1],
        ];
        // 生成
        let fields = Object.entries(MATERIAL_TYPE).flatMap(([_matType, [color, num, _cnum]]) => lodash_1.default.range(0, num).map(_ => component_1.Component.Build(this.scene, new phaser_1.GameObjects.Polygon(this.scene, 0, 0, [0, 0, 1, 1, 1, 2, 0, 3, -1, 2, -1, 1].map(x => x * 50), color))));
        let numberChips = NUMBERCHIP_TYPE.flatMap(([i, num]) => lodash_1.default.range(0, num).map(_ => new chip_1.Chip({
            scene: this.scene,
            text: i.toString(),
            color: 0xeeeeee,
            fontColor: i === 6 || i === 8 ? '#f00' : '#000',
        })));
        let dices = lodash_1.default.range(0, 2).map(_ => new dice_1.Dice({ scene: this.scene }));
        let pieces = lodash_1.default.range(0, USER_COUNT).map(i => [
            ...lodash_1.default.range(0, ROAD_NUM).map(_ => component_1.Component.Build(this.scene, new phaser_1.GameObjects.Rectangle(this.scene, 0, 0, 50, 25, PLAYER_COLOR[i]))),
            ...lodash_1.default.range(0, VILLAGE_NUM).map(_ => component_1.Component.Build(this.scene, new phaser_1.GameObjects.Rectangle(this.scene, 0, 0, 25, 25, PLAYER_COLOR[i]))),
            ...lodash_1.default.range(0, CITY_NUM).map(_ => component_1.Component.Build(this.scene, new phaser_1.GameObjects.Ellipse(this.scene, 0, 0, 50, 50, PLAYER_COLOR[i]))),
        ]);
        let harbors = HARBOR_TYPE.flatMap(([text, num]) => lodash_1.default.range(0, num).map(_ => component_1.Component.Build(this.scene, new phaser_1.GameObjects.Text(this.scene, 0, 0, text, {}))));
        let materialCards = Object.entries(MATERIAL_TYPE).map(([_matType, [color, _num, cnum]]) => lodash_1.default.range(0, cnum).map(_ => new card_1.Card({ scene: this.scene, color })));
        let chanceCards = CHANCECARD_TYPE.flatMap(([text, num]) => lodash_1.default.range(0, num).map(_ => new card_1.Card({ scene: this.scene, text, color: 0xeeeeee, isReversed: true })));
        let achieves = ACHIEVE_TYPE.map(text => new card_1.Card({ scene: this.scene, text, color: 0xeeeeee }));
        let thief = component_1.Component.Build(this.scene, new phaser_1.GameObjects.Text(this.scene, 0, 0, '盗賊', { fontSize: '30', color: '#111' }));
        // シャッフル
        fields = this.scene._.shuffle(fields);
        numberChips = this.scene._.shuffle(numberChips);
        harbors = this.scene._.shuffle(harbors);
        chanceCards = this.scene._.shuffle(chanceCards);
        // 配置
        lodash_1.default.range(0, USER_COUNT).map((index, i) => this.place({ type: 'hand', index }, pieces[i]));
        this.place({ type: 'board' }, [
            ...dices,
            ...achieves,
            thief,
            ...materialCards,
            chanceCards,
            fields,
            numberChips,
            harbors,
        ]);
        return [
            ...fields,
            ...numberChips,
            ...dices,
            ...lodash_1.default.flatten(pieces),
            ...harbors,
            ...lodash_1.default.flatten(materialCards),
            ...chanceCards,
            ...achieves,
            thief,
        ];
    }
}
exports.Katan = Katan;
