"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const schema_1 = require("../../schema");
const const_1 = require("../../const");
class Component {
    constructor({ scene, width, height, x = 0, y = 0, index = null, canTouch = true, }) {
        this.inPointerDown = false;
        this.canTouch = canTouch;
        this.scene = scene;
        this.index = index;
        this.obj = scene.add.container(x, y);
        this.obj.depth = 50;
        this.obj.setSize(width, height);
        this.obj.setInteractive({ draggable: true });
        this.obj.on('drag', (pointer, dragX, dragY) => {
            if (!this.canTouch)
                return;
            if (this.index == null)
                throw new Error('Components index is not set.');
            this.inPointerDown = false;
            if (!this.checkTouchValidArea(scene, pointer.x, pointer.y)) {
                this.scene.input.setDragState(pointer, 0);
                return;
            }
            scene.send({
                type: 'moveComponent',
                index: this.index,
                x: dragX,
                y: dragY,
            });
        });
        this.obj.on('pointerdown', (pointer) => {
            this.inPointerDown = true;
            if (!this.canTouch)
                return;
            if (this.index == null)
                throw new Error('Components index is not set.');
            scene.send({
                type: 'pointerDownComponent',
                index: this.index,
                x: pointer.x,
                y: pointer.y,
            });
        });
        this.obj.on('pointerup', (pointer) => {
            if (this.inPointerDown === false)
                return;
            this.inPointerDown = false;
            if (!this.canTouch)
                return;
            if (this.index == null)
                throw new Error('Components index is not set.');
            if (!this.checkTouchValidArea(scene, pointer.x, pointer.y))
                return;
            scene.send({
                type: 'clickComponent',
                index: this.index,
            });
        });
    }
    move(x, y) {
        this.obj.setPosition(x, y);
    }
    click() { }
    checkTouchValidArea(game, x, y) {
        // 他人のエリアは動かせないようにしたい
        /*
        相手の位置をとってきて動かせない範囲を決める
        */
        let players = schema_1.GetAll(game.room.state.players);
        for (let player of players) {
            if (player.index !== schema_1.Get(game.room.state.players, game.room.sessionId).index) {
                let [maskX, maskY, maskWidth, maskHeight] = const_1.MASK_SHAPE_LIST[player.index];
                if (maskX < x && x < maskX + maskWidth && maskY < y && y < maskY + maskHeight) {
                    // 他人の手札の中にいるのでダメ！
                    return false;
                }
            }
        }
        return true;
    }
    getFontMetrics(fontFamily, fontSize) {
        const metricsKey = fontFamily + fontSize.toString();
        if (Component.fontMetrics[metricsKey] === undefined) {
            Component.fontMetrics[metricsKey] = this.scene.add
                .text(0, 0, '', {
                fontFamily: fontFamily,
                fontSize: fontSize,
            })
                .setVisible(false)
                .getTextMetrics();
        }
        return Component.fontMetrics[metricsKey];
    }
    static Build(scene, shape) {
        const comp = new Component({ scene, width: shape.width, height: shape.height });
        comp.obj.add(shape);
        return comp;
    }
}
exports.Component = Component;
Component.fontMetrics = {};
