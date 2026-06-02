"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOARD_SHAPE = exports.MASK_SHAPE_LIST = exports.HEIGHT = exports.WIDTH = void 0;
exports.WIDTH = 1600;
exports.HEIGHT = 1200;
/** index番のプレイヤーの手札の位置 [x , y, 幅, 高さ] */
exports.MASK_SHAPE_LIST = [
    [(exports.WIDTH / 6) * 0, (exports.HEIGHT / 6) * 0, (exports.WIDTH / 6) * 1, (exports.HEIGHT / 6) * 2],
    [(exports.WIDTH / 6) * 5, (exports.HEIGHT / 6) * 0, (exports.WIDTH / 6) * 1, (exports.HEIGHT / 6) * 2],
    [(exports.WIDTH / 6) * 0, (exports.HEIGHT / 6) * 2, (exports.WIDTH / 6) * 1, (exports.HEIGHT / 6) * 2],
    [(exports.WIDTH / 6) * 5, (exports.HEIGHT / 6) * 2, (exports.WIDTH / 6) * 1, (exports.HEIGHT / 6) * 2],
    [(exports.WIDTH / 6) * 0, (exports.HEIGHT / 6) * 4, (exports.WIDTH / 6) * 1, (exports.HEIGHT / 6) * 2],
    [(exports.WIDTH / 6) * 5, (exports.HEIGHT / 6) * 4, (exports.WIDTH / 6) * 1, (exports.HEIGHT / 6) * 2],
    [(exports.WIDTH / 6) * 1, (exports.HEIGHT / 6) * 0, (exports.WIDTH / 6) * 2, (exports.HEIGHT / 6) * 1],
    [(exports.WIDTH / 6) * 3, (exports.HEIGHT / 6) * 0, (exports.WIDTH / 6) * 2, (exports.HEIGHT / 6) * 1],
    [(exports.WIDTH / 6) * 1, (exports.HEIGHT / 6) * 5, (exports.WIDTH / 6) * 2, (exports.HEIGHT / 6) * 1],
    [(exports.WIDTH / 6) * 3, (exports.HEIGHT / 6) * 5, (exports.WIDTH / 6) * 2, (exports.HEIGHT / 6) * 1],
];
/** ボードの位置 [x , y, 幅, 高さ] */
exports.BOARD_SHAPE = [(exports.WIDTH / 6) * 1, (exports.HEIGHT / 6) * 1, (exports.WIDTH / 6) * 4, (exports.HEIGHT / 6) * 4];
