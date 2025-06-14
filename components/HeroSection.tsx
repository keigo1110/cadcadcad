const HeroSection = () => {
  return (
    <header className="relative z-10 p-4 lg:p-6 pt-8 lg:pt-12">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          OpenSCAD Playground
        </h1>
        <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          言葉から3Dモデルを生成。パラメータで細かく調整。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://nlto3dmodel.vercel.app/#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"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium text-lg"
          >
            今すぐ試してみる
          </a>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
            詳しく見る →
          </a>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;