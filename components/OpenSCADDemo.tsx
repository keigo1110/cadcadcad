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

      {/* ヘッダーナビゲーション */}
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

      {/* ヒーローセクション */}
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

      {/* なぜAI-CADなのか？セクション */}
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

      {/* シンプルな3ステップセクション */}
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

            {/* 開発チームセクション */}
      <section className="relative z-10 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Developed by
          </p>
          <p className="text-gray-400 mb-4">
            東京大学発のクリエイター集団
            <a
              href="https://4zigenhp.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white underline underline-offset-2 decoration-gray-600 hover:decoration-gray-400 transition-colors ml-1"
            >
              4ZIGEN
            </a>
          </p>
        </div>
      </section>

      {/* フッター */}
      <footer className="relative z-10 border-t border-gray-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} 4ZIGEN All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

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