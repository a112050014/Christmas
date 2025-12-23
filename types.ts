
export interface Wish {
  id: string;
  name: string;
  text: string;
  startTime: number;
}

export interface ParticleConfig {
  count: number;
  colorCore: string;
  colorHighlight: string;
  colorEdge: string;
  bloomIntensity: number;
}
