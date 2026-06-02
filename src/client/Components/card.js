"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const component_1 = require("./component");
class Card extends component_1.Component {
    constructor({ scene, text = '', scale = 1.0, color = 0x111, backColor = 0xcb904d, isReversed = false, fontColor = '#000000', fontSize = 27, x = 0, y = 0, index = null, canTouch = true, fontFamily = 'Arial', }) {
        super({
            scene,
            width: Card.WIDTH * scale,
            height: Card.HEIGHT * scale,
            x: x,
            y: y,
            index: index,
            canTouch: canTouch,
        });
        const base = scene.add.rectangle(0, 0, Card.WIDTH * scale, Card.HEIGHT * scale, color);
        this.text = scene.add.text((-fontSize * text.length) / 4, -fontSize / 2, text, {
            fontFamily: fontFamily,
            fontSize: fontSize,
            color: fontColor,
            metrics: this.getFontMetrics(fontFamily, fontSize),
        });
        this.back = scene.add.rectangle(0, 0, Card.WIDTH * scale, Card.HEIGHT * scale, backColor);
        this.back.visible = isReversed;
        this.obj.add([base, this.text, this.back]);
    }
    /**
     * Flip
     */
    click() {
        this.back.visible = !this.back.visible;
    }
}
exports.Card = Card;
Card.WIDTH = 50;
Card.HEIGHT = 80;
