# OpenSCAD Playground

言葉から 3D モデルを生成し、パラメータで細かく調整できるインタラクティブな OpenSCAD プレイグラウンドです。

## 特徴

- 🎯 自然言語プロンプトから 3D モデルを生成
- 🔧 リアルタイムパラメータ調整
- 🎨 美しい 3D プレビュー（Three.js 使用）
- 📱 レスポンシブデザイン
- ⚡ 高速なインタラクティブ体験

## デモ

- L 字ブラケット（M3 ネジ穴付き）
- 収納ボックス（仕切り付き）
- スタンドオフ（基板取り付け用）

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **3D レンダリング**: Three.js
- **スタイリング**: Tailwind CSS
- **デプロイ**: Vercel

## セットアップ

### 前提条件

- Node.js 18.0 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/cadcadcad.git
cd cadcadcad

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## デプロイ

### Vercel でのデプロイ

1. [Vercel](https://vercel.com)にアカウントを作成
2. GitHub リポジトリを接続
3. 自動的にビルド・デプロイが実行されます

または、Vercel CLI を使用：

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel
```

## 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# リント
npm run lint
```

## ライセンス

MIT License
