'use client';

import { useRef, useEffect } from 'react';

interface Parameter {
  label: string;
  value: number;
  min: number;
  max: number;
}

interface Parameters {
  [key: string]: Parameter;
}

interface Demo {
  prompt: string;
  modelType: string;
}

interface MainDemoProps {
  currentStep: number;
  promptText: string;
  parameters: Parameters;
  currentDemo: Demo;
  demos: Demo[];
  currentDemoIndex: number;
  onParameterChange: (paramName: string, value: string) => void;
  onDemoChange: (index: number) => void;
  createModel: (modelType: string, customParams?: any) => void;
  mountRef: React.RefObject<HTMLDivElement>;
}

const MainDemo = ({
  currentStep,
  promptText,
  parameters,
  currentDemo,
  demos,
  currentDemoIndex,
  onParameterChange,
  onDemoChange,
  createModel,
  mountRef
}: MainDemoProps) => {

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* 左側：入力とパラメータ調整 (1/3) */}
        <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-4 lg:h-fit">
          {/* Step 1: プロンプト入力 */}
          <div className={`transition-all duration-500 ${currentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4 lg:p-5">
              <div className="flex items-center mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}>
                  1
                </div>
                <h3 className="ml-2 text-base font-semibold">プロンプトを入力</h3>
              </div>
              <div className="bg-black/50 rounded-lg p-3 font-mono text-sm lg:text-base text-green-400 border border-green-900/30 shadow-lg shadow-green-900/20">
                <span className="text-gray-500">$ </span>
                {promptText}
                {currentStep === 1 && (
                  promptText.length === currentDemo.prompt.length ? (
                    <span className="text-gray-400 ml-2">↵</span>
                  ) : (
                    <span className="animate-pulse">|</span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Step 2: パラメータ調整 */}
          <div className={`transition-all duration-500 ${currentStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4 lg:p-5">
              <div className="flex items-center mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}>
                  2
                </div>
                <h3 className="ml-2 text-base font-semibold">パラメータ調整</h3>
                <span className="ml-auto text-xs text-green-400">インタラクティブ</span>
              </div>
              <div className="space-y-2.5">
                {Object.entries(parameters).map(([key, param]: [string, any]) => (
                  <div key={key} className="space-y-0.5">
                    <div className="flex justify-between text-xs lg:text-sm">
                      <label className="text-gray-300 font-medium">{param.label}</label>
                      <span className="font-mono text-blue-400 font-semibold text-xs">{param.value}</span>
                    </div>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      value={param.value}
                      onChange={(e) => onParameterChange(key, e.target.value)}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右側：3Dビュー (2/3) */}
        <div className="lg:col-span-2 lg:sticky lg:top-4 lg:h-fit">
          {/* 3Dモデル */}
          <div className={`transition-all duration-500 ${currentStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4 lg:p-5">
              <div className="flex items-center mb-3">
                <h3 className="text-base font-semibold">3Dプレビュー</h3>
                <div className="ml-auto flex space-x-1">
                  <button className="p-0.5 hover:bg-gray-800 rounded transition-colors group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button className="p-0.5 hover:bg-gray-800 rounded transition-colors group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref={mountRef}
                className="relative h-[380px] lg:h-[460px] bg-black/30 rounded-lg overflow-hidden"
                style={{
                  background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 進捗インジケーター */}
      <div className="flex justify-center mt-4 space-x-3 lg:hidden">
        {demos.map((_, index) => (
          <button
            key={index}
            onClick={() => onDemoChange(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentDemoIndex
                ? 'w-12 bg-gradient-to-r from-blue-500 to-purple-500'
                : 'w-2 bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          background: #60a5fa;
          transform: scale(1.2);
        }

        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
          transition: all 0.2s;
        }

        .slider::-moz-range-thumb:hover {
          background: #60a5fa;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default MainDemo;