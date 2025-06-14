import { Demo } from '../utils/modelCreators';

export const demos: Demo[] = [
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