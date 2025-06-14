const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-10 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* セクションヘッダー */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            「自然言語+GUIパラメータ」CAD
          </h2>
          <p className="text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto">
            従来のCADツールの複雑さを解消し、誰でも3Dモデリングができるを実現します
          </p>
        </div>

        {/* 特徴カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* 自然言語プロンプト */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 lg:p-8 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white">自然言語から形を作れる</h3>
            <p className="text-gray-300 leading-relaxed">
              「歯車を作って」「ブラケットが欲しいな」など、日本語で思いを伝えるだけでAIが3Dモデルを生成
            </p>
          </div>

          {/* 直感的パラメータ調整 */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 lg:p-8 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white">直感的なパラメータ調整</h3>
            <p className="text-gray-300 leading-relaxed">
              生成されたモデルをGUIで簡単に微調整。寸法、形状を思いのまま
            </p>
          </div>

          {/* OpenSCADコード生成 */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 lg:p-8 hover:border-green-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white">繰り返せる言語指示</h3>
            <p className="text-gray-300 leading-relaxed">
              現状の状態をAIと共有した状態で追加の言語指示が可能
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;