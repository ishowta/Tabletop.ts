"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chip = void 0;
const component_1 = require("./component");
class Chip extends component_1.Component {
    constructor({ scene, text = '', scale = 1.0, color = 0x111, fontColor = '#000000', fontSize = 15, x = 0, y = 0, index = null, canTouch = true, fontFamily = 'Arial', }) {
        super({
            scene,
            width: Chip.SIZE * 2 * scale,
            height: Chip.SIZE * 2 * scale,
            x: x,
            y: y,
            index: index,
            canTouch: canTouch,
        });
        const baseObj = scene.add.circle(0, 0, Chip.SIZE * scale, color);
        const textObj = scene.add.text((-fontSize * text.length) / 4, -fontSize / 2, text, {
            fontFamily: fontFamily,
            fontSize: fontSize,
            color: fontColor,
            metrics: this.getFontMetrics(fontFamily, fontSize),
        });
        this.obj.add([baseObj, textObj]);
    }
    click() { }
}
exports.Chip = Chip;
Chip.SIZE = 15;
