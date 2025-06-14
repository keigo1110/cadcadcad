import { useState, useEffect, useRef } from 'react';
import { Demo, DemoParams } from '../utils/modelCreators';

export const useDemoAnimation = (
  demos: Demo[],
  createModelCallback: (modelType: string, params?: DemoParams) => void
) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [promptText, setPromptText] = useState('');
  const [parameters, setParameters] = useState<DemoParams>({});
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const createModelRef = useRef(createModelCallback);

  // createModelCallbackの参照を更新
  createModelRef.current = createModelCallback;

  const currentDemo = demos[currentDemoIndex];

  // アニメーションシーケンス
  useEffect(() => {
    if (!demos.length || !currentDemo) return;

    // 初期化
    setCurrentStep(0);
    setPromptText('');
    setParameters({});

    // Step 1: プロンプト入力開始 (500ms後)
    const timer1 = setTimeout(() => {
      setCurrentStep(1);

      // タイピングアニメーション
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex <= currentDemo.prompt.length) {
          setPromptText(currentDemo.prompt.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);

          // Step 2: 3Dモデル生成 (800ms後)
          const timer2 = setTimeout(() => {
            setCurrentStep(2);
            const initialParams: DemoParams = {};
            Object.entries(currentDemo.params).forEach(([key, param]) => {
              initialParams[key] = param;
            });
            setParameters(initialParams);
            createModelRef.current(currentDemo.modelType, initialParams);

            // Step 3: パラメータ調整可能 (800ms後)
            const timer3 = setTimeout(() => {
              setCurrentStep(3);

              // 次のデモへ (5秒後)
              const timer4 = setTimeout(() => {
                setCurrentDemoIndex((prev) => (prev + 1) % demos.length);
              }, 5000);

              return () => clearTimeout(timer4);
            }, 800);

            return () => clearTimeout(timer3);
          }, 800);

          return () => clearTimeout(timer2);
        }
      }, 60);

      return () => clearInterval(typeInterval);
    }, 500);

    return () => clearTimeout(timer1);
  }, [currentDemoIndex, demos, currentDemo]);

  // パラメータ変更ハンドラ
  const handleParameterChange = (paramName: string, value: string) => {
    if (!currentDemo) return;

    const newParams = {
      ...parameters,
      [paramName]: { ...parameters[paramName], value: parseFloat(value) }
    };
    setParameters(newParams);
    createModelRef.current(currentDemo.modelType, newParams);
  };

  // 手動でデモを切り替える関数
  const handleDemoChange = (index: number) => {
    setCurrentDemoIndex(index);
  };

  return {
    currentStep,
    promptText,
    parameters,
    currentDemoIndex,
    currentDemo: currentDemo || demos[0],
    handleParameterChange,
    setCurrentDemoIndex: handleDemoChange
  };
};