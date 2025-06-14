'use client';

import React, { useCallback } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import MainDemo from './MainDemo';
import FeaturesSection from './FeaturesSection';
import StepsSection from './StepsSection';
import DeveloperSection from './DeveloperSection';
import Footer from './Footer';
import { useThreeJS } from './hooks/useThreeJS';
import { useDemoAnimation } from './hooks/useDemoAnimation';
import { createModel } from './utils/modelCreators';
import { demos } from './data/demoData';

const OpenSCADDemo = () => {
  const { mountRef, sceneRef, modelRef } = useThreeJS();

  const createModelCallback = useCallback((modelType: string, customParams?: any) => {
    createModel(modelType, demos, customParams || {}, sceneRef, modelRef);
  }, [sceneRef, modelRef]);

  const {
    currentStep,
    promptText,
    parameters,
    currentDemoIndex,
    currentDemo,
    handleParameterChange,
    setCurrentDemoIndex
  } = useDemoAnimation(demos, createModelCallback);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 背景のグラデーション */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20" />

      <Header />
      <HeroSection />

      <MainDemo
        currentStep={currentStep}
        promptText={promptText}
        parameters={parameters}
        currentDemo={currentDemo}
        demos={demos}
        currentDemoIndex={currentDemoIndex}
        onParameterChange={handleParameterChange}
        onDemoChange={setCurrentDemoIndex}
        createModel={createModelCallback}
        mountRef={mountRef}
      />

      <FeaturesSection />

      <StepsSection />
      <DeveloperSection />
      <Footer />

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

export default OpenSCADDemo;