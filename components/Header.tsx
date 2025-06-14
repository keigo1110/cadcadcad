const Header = () => {
  return (
    <nav className="relative z-20 border-b border-gray-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              OpenSCAD Playground
            </span>
          </div>

          {/* ナビゲーションメニュー */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">特徴</a>
            <a href="#steps" className="text-gray-300 hover:text-white transition-colors">使い方</a>
            <a
              href="https://nlto3dmodel.vercel.app/#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"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium"
            >
              デモを試す
            </a>
          </div>

          {/* モバイルメニューボタン */}
          <button className="md:hidden p-2 text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;