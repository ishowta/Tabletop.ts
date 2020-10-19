# Tabletop.ts

Tabletop simulator on the Web

![スクリーンショット](screenshot.png)

## Concept

- コンポーネントと初期化処理だけで簡単にテーブルゲームが作れる

  ↓ トランプゲームのコード ↓

  ![トランプゲームのコード](code.png)

## Architecture

- ゲームは以下の要素によって構成されている
  - 初期化処理（`create()->Components[]`）
  - イベント（`{move(), click()}`）
  - コンポーネント群（`Components[]`）
- ゲームは初期化時にリセットされ、イベント（`event.ts`）の送受信によって状態が共有される
- ゲーム外の状態はColyseusによって共有される（`schema.ts`）

## Structure

```txt
src
├── client
│   ├── Components
│   │   ├── component.ts # コンポーネントの基底クラス
│   │   ├── card.ts # カードゲーム用のカードコンポーネント
│   │   └── ... # いろいろなコンポーネント
│   ├── Games
│   │   ├── game.ts # ゲームの基底クラス
│   │   ├── gameList.ts # ゲームリスト
│   │   └── ... # いろいろなゲーム
│   ├── const.ts # 定数
│   ├── index.ts # クライアントのエントリ
│   ├── event.ts # クライアント間でゲームの状態を共有するためのイベントタイプ
│   └── gamescene.ts # ゲームの管理（クライアント）
├── router.ts # サーバーとクライアントを管理・実行するルーター
├── schema.ts # ゲーム外の状態（プレイヤー情報）などを保持するためのスキーマ（Colyseusによって状態が管理される）
└── server
    └── gameroom.ts # ゲームの管理（サーバー）
```
