'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const OpenSCADDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [promptText, setPromptText] = useState('');
  const [parameters, setParameters] = useState<any>({});
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const demos = [
    {
      prompt: 'L字ブラケットを作って、M3のネジ穴付き',
      modelType: 'bracket',
      params: {
        width: { value: 30, min: 20, max: 50, label: '幅 (mm)' },
        height: { value: 40, min: 30, max: 60, label: '高さ (mm)' },
        thickness: { value: 3, min: 2, max: 8, label: '厚み (mm)' },
        hole_size: { value: 3, min: 2, max: 6, label: 'ネジ穴径 (mm)' }
      }
    },
    {
      prompt: '収納ボックスを作って、仕切り付き',
      modelType: 'box',
      params: {
        length: { value: 80, min: 50, max: 120, label: '長さ (mm)' },
        width: { value: 60, min: 40, max: 100, label: '幅 (mm)' },
        height: { value: 40, min: 20, max: 60, label: '高さ (mm)' },
        dividers: { value: 2, min: 0, max: 4, label: '仕切り数' }
      }
    },
    {
      prompt: 'スタンドオフを作って、基板取り付け用',
      modelType: 'standoff',
      params: {
        diameter: { value: 8, min: 6, max: 12, label: '直径 (mm)' },
        height: { value: 10, min: 5, max: 20, label: '高さ (mm)' },
        hole_diameter: { value: 3, min: 2, max: 5, label: 'ネジ穴径 (mm)' },
        hex_size: { value: 6, min: 5, max: 10, label: '六角部サイズ (mm)' }
      }
    }
  ];

  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const currentDemo = demos[currentDemoIndex];

  // Three.js セットアップ
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ライティング
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // グリッドヘルパー
    const gridHelper = new THREE.GridHelper(12, 12, 0x333333, 0x222222);
    scene.add(gridHelper);

    // マウスコントロール
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    mountRef.current.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // カメラの緩やかな動き
      camera.position.x = 10 * Math.cos(Date.now() * 0.0002) + mouseX * 2;
      camera.position.z = 10 * Math.sin(Date.now() * 0.0002) + mouseY * 2;
      camera.lookAt(0, 0, 0);

      if (modelRef.current) {
        modelRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // リサイズ対応
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      mountRef.current?.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // モデルの作成/更新
  const createModel = (modelType, customParams = null) => {
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current.traverse((child) => {
        if ((child as any).geometry) (child as any).geometry.dispose();
        if ((child as any).material) (child as any).material.dispose();
      });
    }

    const group = new THREE.Group();
    const demo = demos.find(d => d.modelType === modelType);
    if (!demo) return;

    const params = customParams || parameters || {};

    // パラメータが空の場合はデフォルト値を使用
    const hasParams = Object.keys(params).length > 0;

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      metalness: 0.4,
      roughness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1
    });

    if (modelType === 'bracket') { // L-Bracket
      const getParam = (name) => {
        if (hasParams && params[name] && params[name].value !== undefined) {
          return params[name].value;
        }
        return demo.params[name].value;
      };

      const width = getParam('width') * 0.045;
      const height = getParam('height') * 0.045;
      const thickness = getParam('thickness') * 0.09;
      const holeSize = getParam('hole_size') * 0.045;

      // 垂直部分
      const verticalGeometry = new THREE.BoxGeometry(thickness, height, width);
      const verticalMesh = new THREE.Mesh(verticalGeometry, material);
      verticalMesh.position.set(-height/2 + thickness/2, height/2, 0);
      verticalMesh.castShadow = true;
      group.add(verticalMesh);

      // 水平部分
      const horizontalGeometry = new THREE.BoxGeometry(height, thickness, width);
      const horizontalMesh = new THREE.Mesh(horizontalGeometry, material);
      horizontalMesh.position.set(0, thickness/2, 0);
      horizontalMesh.castShadow = true;
      group.add(horizontalMesh);

      // ネジ穴
      const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const holeGeometry = new THREE.CylinderGeometry(holeSize, holeSize, thickness + 0.1, 16);

      const hole1 = new THREE.Mesh(holeGeometry, holeMaterial);
      hole1.rotation.z = Math.PI / 2;
      hole1.position.set(-height/2 + thickness/2, height * 0.7, 0);
      group.add(hole1);

      const hole2 = new THREE.Mesh(holeGeometry, holeMaterial);
      hole2.position.set(height * 0.3, thickness/2, 0);
      group.add(hole2);

    } else if (modelType === 'box') { // Storage Box
      const getParam = (name) => {
        if (hasParams && params[name] && params[name].value !== undefined) {
          return params[name].value;
        }
        return demo.params[name].value;
      };

      const length = getParam('length') * 0.028;
      const width = getParam('width') * 0.028;
      const height = getParam('height') * 0.045;
      const dividers = Math.floor(getParam('dividers'));

      // ボックスのマテリアル
      const boxMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2
      });

      const wallThickness = 0.12;

      // 底面
      const bottomGeometry = new THREE.BoxGeometry(length, wallThickness, width);
      const bottomMesh = new THREE.Mesh(bottomGeometry, boxMaterial);
      bottomMesh.position.y = -height/2 + wallThickness/2;
      bottomMesh.castShadow = true;
      group.add(bottomMesh);

      // 前面
      const frontGeometry = new THREE.BoxGeometry(length, height, wallThickness);
      const frontMesh = new THREE.Mesh(frontGeometry, boxMaterial);
      frontMesh.position.z = width/2 - wallThickness/2;
      frontMesh.castShadow = true;
      group.add(frontMesh);

      // 背面
      const backMesh = new THREE.Mesh(frontGeometry, boxMaterial);
      backMesh.position.z = -width/2 + wallThickness/2;
      backMesh.castShadow = true;
      group.add(backMesh);

      // 左側面
      const sideGeometry = new THREE.BoxGeometry(wallThickness, height, width);
      const leftMesh = new THREE.Mesh(sideGeometry, boxMaterial);
      leftMesh.position.x = -length/2 + wallThickness/2;
      leftMesh.castShadow = true;
      group.add(leftMesh);

      // 右側面
      const rightMesh = new THREE.Mesh(sideGeometry, boxMaterial);
      rightMesh.position.x = length/2 - wallThickness/2;
      rightMesh.castShadow = true;
      group.add(rightMesh);

      // 仕切り板
      if (dividers > 0) {
        const dividerGeometry = new THREE.BoxGeometry(
          wallThickness / 2,
          height * 0.75,
          width - wallThickness * 2
        );

        for (let i = 1; i <= dividers; i++) {
          const divider = new THREE.Mesh(dividerGeometry, boxMaterial);
          const spacing = length / (dividers + 1);
          divider.position.x = -length/2 + spacing * i;
          divider.position.y = -height * 0.125;
          divider.castShadow = true;
          group.add(divider);
        }
      }

    } else if (modelType === 'standoff') { // Standoff
      const getParam = (name) => {
        if (hasParams && params[name] && params[name].value !== undefined) {
          return params[name].value;
        }
        return demo.params[name].value;
      };

      const diameter = getParam('diameter') * 0.09;
      const height = getParam('height') * 0.09;
      const holeRadius = getParam('hole_diameter') * 0.045;
      const hexSize = getParam('hex_size') * 0.09;

      // スタンドオフのマテリアル
      const standoffMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.4,
        clearcoatRoughness: 0.1
      });

      // メインの円筒部分
      const cylinderGeometry = new THREE.CylinderGeometry(diameter/2, diameter/2, height * 0.6, 32);
      const cylinderMesh = new THREE.Mesh(cylinderGeometry, standoffMaterial);
      cylinderMesh.castShadow = true;
      group.add(cylinderMesh);

      // 六角形の部分（簡略化のため円筒で代用）
      const hexGeometry = new THREE.CylinderGeometry(hexSize/2, hexSize/2, height * 0.4, 6);
      const hexMesh = new THREE.Mesh(hexGeometry, standoffMaterial);
      hexMesh.position.y = height * 0.5;
      hexMesh.castShadow = true;
      group.add(hexMesh);

      // 中央のネジ穴
      const holeGeometry = new THREE.CylinderGeometry(holeRadius, holeRadius, height + 0.2, 16);
      const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const hole = new THREE.Mesh(holeGeometry, holeMaterial);
      group.add(hole);
    }

    modelRef.current = group;
    sceneRef.current.add(group);
  };

  // アニメーションシーケンス
  useEffect(() => {
    const runDemo = async () => {
      // リセット
      setCurrentStep(0);
      setPromptText('');
      setParameters({});

      // Step 1: プロンプト入力
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentStep(1);

      const prompt = currentDemo.prompt;
      for (let i = 0; i <= prompt.length; i++) {
        setPromptText(prompt.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // エンターキー押下の演出
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: 3Dモデル生成
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentStep(2);
      const initialParams = {};
      Object.entries(currentDemo.params).forEach(([key, param]) => {
        initialParams[key] = param;
      });
      setParameters(initialParams);
      createModel(currentDemo.modelType, initialParams);

      // Step 3: パラメータ調整可能
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentStep(3);

      // 次のデモへ
      await new Promise(resolve => setTimeout(resolve, 5000));
      setCurrentDemoIndex((prev) => (prev + 1) % demos.length);
    };

    runDemo();
  }, [currentDemoIndex]);

  // パラメータ変更ハンドラ
  const handleParameterChange = (paramName, value) => {
    const newParams = {
      ...parameters,
      [paramName]: { ...parameters[paramName], value: parseFloat(value) }
    };
    setParameters(newParams);
    createModel(currentDemo.modelType, newParams);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 背景のグラデーション */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20" />

      {/* ヘッダー */}
      <header className="relative z-10 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            OpenSCAD Playground
          </h1>
          <p className="text-base lg:text-lg text-gray-300">
            言葉から3Dモデルを生成。パラメータで細かく調整。
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
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
                  {currentStep === 1 && promptText.length === currentDemo.prompt.length ? (
                    <span className="text-gray-400 ml-2">↵</span>
                  ) : currentStep === 1 ? (
                    <span className="animate-pulse">|</span>
                  ) : null}
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
                        onChange={(e) => handleParameterChange(key, e.target.value)}
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
              onClick={() => setCurrentDemoIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentDemoIndex
                  ? 'w-12 bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
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

export default OpenSCADDemo;