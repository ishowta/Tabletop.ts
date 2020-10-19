export const WIDTH = 1900
export const HEIGHT = 1100
/** index番のプレイヤーの手札の位置 [x , y, 幅, 高さ] */
export const MASK_SHAPE_LIST = [
  [(WIDTH / 6) * 0, (HEIGHT / 6) * 0, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
  [(WIDTH / 6) * 5, (HEIGHT / 6) * 0, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
  [(WIDTH / 6) * 0, (HEIGHT / 6) * 2, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
  [(WIDTH / 6) * 5, (HEIGHT / 6) * 2, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
  [(WIDTH / 6) * 0, (HEIGHT / 6) * 4, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
  [(WIDTH / 6) * 5, (HEIGHT / 6) * 4, (WIDTH / 6) * 1, (HEIGHT / 6) * 2],
  [(WIDTH / 6) * 1, (HEIGHT / 6) * 0, (WIDTH / 6) * 2, (HEIGHT / 6) * 1],
  [(WIDTH / 6) * 3, (HEIGHT / 6) * 0, (WIDTH / 6) * 2, (HEIGHT / 6) * 1],
  [(WIDTH / 6) * 1, (HEIGHT / 6) * 5, (WIDTH / 6) * 2, (HEIGHT / 6) * 1],
  [(WIDTH / 6) * 3, (HEIGHT / 6) * 5, (WIDTH / 6) * 2, (HEIGHT / 6) * 1],
]
/** ボードの位置 [x , y, 幅, 高さ] */
export const BOARD_SHAPE = [(WIDTH / 6) * 1, (HEIGHT / 6) * 1, (WIDTH / 6) * 5, (HEIGHT / 6) * 5]
