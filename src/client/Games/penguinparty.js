"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenguinParty = void 0;
const game_1 = require("./game");
const chip_1 = require("../Components/chip");
const card_1 = require("../Components/card");
class PenguinParty extends game_1.Game {
    create() {
        // Cards
        const CARD_TYPE = [
            [0x7ca247, 8],
            [0xfbe400, 7],
            [0xe24c2d, 7],
            [0x614f9e, 7],
            [0x75c4ea, 7],
        ];
        let cards = [];
        for (let [color, num] of CARD_TYPE) {
            for (let i = 0; i < num; ++i) {
                cards.push(new card_1.Card({ scene: this.scene, color }));
            }
        }
        cards = this.scene._.shuffle(cards);
        this.distribute(cards);
        // Chips
        const CHIP_TYPE = [
            [0xffd700, 20, 1.0],
            [0xb22222, 10, 1.5],
        ];
        let chips = [];
        for (let [color, num, scale] of CHIP_TYPE) {
            for (let i = 0; i < num; ++i) {
                chips.push(new chip_1.Chip({ scene: this.scene, color: color, scale: scale }));
            }
        }
        this.place({ type: 'board' }, chips);
        return [...cards, ...chips];
    }
}
exports.PenguinParty = PenguinParty;
