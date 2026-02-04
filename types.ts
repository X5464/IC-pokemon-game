
export enum GameState {
  INTRO = 'INTRO',
  TUTORIAL = 'TUTORIAL',
  OVERWORLD = 'OVERWORLD',
  BATTLE = 'BATTLE',
  DIALOGUE = 'DIALOGUE',
  MENU = 'MENU'
}

export type TileType = 'GRASS' | 'TALL_GRASS' | 'PATH' | 'WATER' | 'WALL' | 'FENCE' | 'DIRT';

export interface Move {
  name: string;
  article: string;
  power: number;
  description: string;
  animationClass: string;
}

export interface ConstitutionalPokemon {
  name: string;
  nickname: string;
  level: number;
  hp: number;
  maxHp: number;
  frontSprite: string;
  backSprite: string;
  moves: Move[];
}

export interface Opponent {
  name: string;
  health: number;
  maxHealth: number;
  argument: string;
  weakness: string;
  spriteUrl: string;
}

export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  dialogue: string[];
  relatedArticles?: (string | null)[]; // Maps to dialogue index
  spriteUrl: string;
}

export interface GameProgress {
  level: number;
  score: number;
  completedLevels: string[];
  party: ConstitutionalPokemon[];
  playerPos: { x: number, y: number };
  lastSaved: string;
  trainerType: 'RED' | 'LEAF';
}

export interface ScenarioChoice {
  text: string;
  isCorrect: boolean;
  constitutionalReference: string;
  explanation: string;
}

export interface Scenario {
  title: string;
  context: string;
  choices: ScenarioChoice[];
}

export interface ArticleDetail {
  title: string;
  summary: string;
  significance: string;
}
