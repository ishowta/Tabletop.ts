"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayingCard = void 0;
const game_1 = require("./game");
const card_1 = require("../Components/card");
const lodash_1 = __importDefault(require("lodash"));
class PlayingCard extends game_1.Game {
    constructor() {
        super(...arguments);
        this.create = () => {
            // Build cards
            let cards = this.buildPlayingCard();
            // Shuffle cards
            cards = this.scene._.shuffle(cards);
            // Distribute cards
            this.distribute(cards);
            return cards;
        };
        this.buildPlayingCard = () => [
            ...lodash_1.default.range(0, 13).flatMap(i => ['♥', '♠', '♦', '♣'].map(type => new card_1.Card({
                scene: this.scene,
                text: `${type}${i + 1}`,
                color: 0xeeeeee,
                fontColor: ['♥', '♦'].includes(type) ? '#f00' : '#000',
            }))),
            ...lodash_1.default.range(0, 2).map(_ => new card_1.Card({
                scene: this.scene,
                text: `🃏`,
                color: 0xeeeeee,
                fontColor: '#000',
                fontSize: 60,
            })),
        ];
    }
}
exports.PlayingCard = PlayingCard;
