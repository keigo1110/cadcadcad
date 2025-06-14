# 技術スタック

## フロントエンド

- **フレームワーク**: Next.js 14.2.30 (App Router)
- **言語**: TypeScript 5.3.3
- **UI ライブラリ**: React 18.2.0
- **スタイリング**: Tailwind CSS 3.4.0
- **3D レンダリング**: Three.js 0.158.0

## 開発ツール

- **リンター**: ESLint 8.56.0
- **PostCSS**: 8.4.32
- **Autoprefixer**: 10.4.16

## デプロイ

- **プラットフォーム**: Vercel
- **Node.js**: 18.x
- **ビルドツール**: Next.js Build System

## パッケージマネージャー

- **npm**: 使用中

## 主要な依存関係

```json
{
  "next": "14.2.30",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "three": "^0.158.0",
  "@types/three": "^0.158.3"
}
```

## 開発依存関係

```json
{
  "@types/node": "^20.10.5",
  "@types/react": "^18.2.45",
  "@types/react-dom": "^18.2.18",
  "autoprefixer": "^10.4.16",
  "eslint": "^8.56.0",
  "eslint-config-next": "14.2.30",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.4.0",
  "typescript": "^5.3.3"
}
```

## 注意事項

- Three.js の SSR 対応のため、コンポーネントは'use client'ディレクティブを使用
- TypeScript の厳密モードは一時的に無効化（型エラー回避のため）
- Vercel での最適化のため next.config.js で webpack 設定をカスタマイズ
