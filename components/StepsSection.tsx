const StepsSection = () => {
  return (
    <section id="steps" className="relative z-10 py-16 lg:py-24 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* セクションヘッダー */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            シンプルな3ステップ
          </h2>
          <p className="text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto">
            複雑な操作は不要。誰でも簡単に3Dモデリングを始められます
          </p>
        </div>

        {/* ステップカード */}
        <div className="relative">
          {/* デスクトップ版 */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* ステップ1 */}
            <div className="text-center group relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25 relative z-10">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white">プロンプト入力</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                「机の脚を作って」「スマホスタンドが欲しいな」など、自然な日本語で要望を入力
              </p>

              {/* 矢印 */}
              <div className="absolute top-10 left-full w-12 lg:w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-x-6 lg:-translate-x-8">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-purple-500 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
              </div>
            </div>

            {/* ステップ2 */}
            <div className="text-center group relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25 relative z-10">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white">AI生成</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                AIが要望を理解し、最適な3Dモデルとパラメータ調整GUIを数秒で生成。リアルタイムプレビューで確認
              </p>

              {/* 矢印 */}
              <div className="absolute top-10 left-full w-12 lg:w-16 h-0.5 bg-gradient-to-r from-purple-500 to-green-500 transform -translate-x-6 lg:-translate-x-8">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-green-500 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
              </div>
            </div>

            {/* ステップ3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25 relative z-10">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white">調整・出力</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                GUIパラメータで細かく調整し、STLで出力完了
              </p>
            </div>
          </div>

          {/* モバイル版 */}
          <div className="md:hidden space-y-8">
            {/* ステップ1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">プロンプト入力</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                「机の脚を作って」「スマホスタンドが欲しいな」など、自然な日本語で要望を入力
              </p>
            </div>

            {/* 矢印1→2 */}
            <div className="flex justify-center">
              <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500 to-purple-500 relative">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-4 border-t-purple-500 border-l-2 border-r-2 border-l-transparent border-r-transparent"></div>
              </div>
            </div>

            {/* ステップ2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">AI生成</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                AIが要望を理解し、最適な3Dモデルとパラメータ調整GUIを数秒で生成。リアルタイムプレビューで確認
              </p>
            </div>

            {/* 矢印2→3 */}
            <div className="flex justify-center">
              <div className="w-0.5 h-12 bg-gradient-to-b from-purple-500 to-green-500 relative">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-4 border-t-green-500 border-l-2 border-r-2 border-l-transparent border-r-transparent"></div>
              </div>
            </div>

            {/* ステップ3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">調整・出力</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                GUIパラメータで細かく調整し、STLで出力完了
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;