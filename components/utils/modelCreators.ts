import * as THREE from 'three';

export interface DemoParams {
  [key: string]: {
    value: number;
    min: number;
    max: number;
    label: string;
  };
}

export interface Demo {
  prompt: string;
  modelType: string;
  params: DemoParams;
}

const createBracketModel = (params: DemoParams, demo: Demo, hasParams: boolean): THREE.Group => {
  const group = new THREE.Group();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x3b82f6,
    metalness: 0.4,
    roughness: 0.1,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1
  });

  const getParam = (name: string) => {
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

  return group;
};

const createBoxModel = (params: DemoParams, demo: Demo, hasParams: boolean): THREE.Group => {
  const group = new THREE.Group();

  const getParam = (name: string) => {
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

  return group;
};

const createStandoffModel = (params: DemoParams, demo: Demo, hasParams: boolean): THREE.Group => {
  const group = new THREE.Group();

  const getParam = (name: string) => {
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

  return group;
};

export const createModel = (
  modelType: string,
  demos: Demo[],
  params: DemoParams = {},
  sceneRef: React.MutableRefObject<THREE.Scene | null>,
  modelRef: React.MutableRefObject<THREE.Group | null>
): void => {
  if (modelRef.current) {
    sceneRef.current?.remove(modelRef.current);
    modelRef.current.traverse((child) => {
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) (child as any).material.dispose();
    });
  }

  const demo = demos.find(d => d.modelType === modelType);
  if (!demo) return;

  // パラメータが空の場合はデフォルト値を使用
  const hasParams = Object.keys(params).length > 0;

  let group: THREE.Group;

  switch (modelType) {
    case 'bracket':
      group = createBracketModel(params, demo, hasParams);
      break;
    case 'box':
      group = createBoxModel(params, demo, hasParams);
      break;
    case 'standoff':
      group = createStandoffModel(params, demo, hasParams);
      break;
    default:
      return;
  }

  modelRef.current = group;
  sceneRef.current?.add(group);
};