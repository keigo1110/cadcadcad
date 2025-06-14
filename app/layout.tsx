import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenSCAD Playground - 言葉から3Dモデルを生成',
  description: '自然言語から3Dモデルを生成し、パラメータで細かく調整できるOpenSCADプレイグラウンド',
  keywords: ['OpenSCAD', '3D', 'CAD', 'モデリング', 'パラメトリック'],
  authors: [{ name: 'cadcadcad' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}