import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useThreeJS = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

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
    const handleMouseMove = (e: MouseEvent) => {
      if (!mountRef.current) return;
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

  return {
    mountRef,
    sceneRef,
    rendererRef,
    frameRef,
    modelRef,
    cameraRef
  };
};