# ディレクトリ構成

```
cadcadcad/
├── app/                          # Next.js App Router
│   ├── globals.css              # グローバルスタイル（Tailwind CSS）
│   ├── layout.tsx               # ルートレイアウト
│   └── page.tsx                 # ホームページ
├── components/                   # Reactコンポーネント
│   └── OpenSCADDemo.tsx         # メインの3Dデモコンポーネント
├── .gitignore                   # Git除外ファイル
├── .next/                       # Next.jsビルド出力（自動生成）
├── directorystructure.md        # このファイル
├── next.config.js               # Next.js設定
├── next-env.d.ts               # Next.js型定義（自動生成）
├── node_modules/               # 依存関係（自動生成）
├── package.json                # パッケージ設定
├── package-lock.json           # 依存関係ロック（自動生成）
├── postcss.config.js           # PostCSS設定
├── README.md                   # プロジェクト説明
├── tailwind.config.js          # Tailwind CSS設定
├── technologystack.md          # 技術スタック記録
├── tsconfig.json               # TypeScript設定
└── vercel.json                 # Vercelデプロイ設定
```

## 主要ファイルの説明

### `/app` ディレクトリ

- **layout.tsx**: アプリケーション全体のレイアウトとメタデータ
- **page.tsx**: ホームページ（OpenSCADDemo コンポーネントを表示）
- **globals.css**: Tailwind CSS のディレクティブとグローバルスタイル

### `/components` ディレクトリ

- **OpenSCADDemo.tsx**: メインの 3D デモコンポーネント
  - Three.js を使用した 3D レンダリング
  - インタラクティブなパラメータ調整
  - レスポンシブデザイン

### 設定ファイル

- **next.config.js**: Three.js 対応の Webpack 設定
- **tsconfig.json**: TypeScript 設定（strict: false）
- **tailwind.config.js**: Tailwind CSS 設定
- **postcss.config.js**: PostCSS 設定
- **vercel.json**: Vercel デプロイ最適化設定

## 開発時の注意点

- `components/`内のファイルは'use client'ディレクティブが必要（Three.js 使用のため）
- 新しいコンポーネントは`components/`ディレクトリに配置
- スタイルは Tailwind CSS クラスを使用
- 型定義は TypeScript で記述（現在は緩い設定）
