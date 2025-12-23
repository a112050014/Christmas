
import { ParticleConfig } from './types';

export const TREE_CONFIG: ParticleConfig = {
  count: 60000, // 稍微降低密度以減少視覺擁擠
  colorCore: '#d81b60', // 深洋紅色，增加對比
  colorHighlight: '#ff4081', // 亮粉色
  colorEdge: '#ffeb3b', // 明亮黃色，用於邊緣點綴
  bloomIntensity: 0.8, // 降低基礎輝光強度
};

export const SNOW_CONFIG = {
  count: 2000,
  color: '#ffffff',
};

export const BASE_RINGS_CONFIG = {
  count: 3,
  color: '#ffd700',
};
