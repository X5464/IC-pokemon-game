import { Move, ConstitutionalPokemon, NPC, ArticleDetail, TileType } from './types';

export const SYSTEM_PROMPT = "You are a constitutional expert. Generate 'Constitutional Distortions'—scenarios where rights are being violated. The player must use the correct Article to 'rectify' the situation. Provide educational feedback explaining the legal principle used.";

export const ARTICLE_DETAILS: Record<string, ArticleDetail> = {
  "Article 14": {
    title: "Equality Before Law",
    summary: "Ensures equality before law and equal protection of laws. No person is above the law.",
    significance: "This is the bedrock of democracy. It prevents arbitrary government action and ensures justice for all."
  },
  "Article 19": {
    title: "Right to Freedom",
    summary: "Guarantees freedom of speech, assembly, association, movement, residence, and profession.",
    significance: "These are the civil liberties that allow citizens to live with dignity and participate in democratic processes."
  },
  "Article 21": {
    title: "Right to Life & Personal Liberty",
    summary: "No person shall be deprived of life or personal liberty except by procedure established by law.",
    significance: "The Supreme Court has expanded this to include the right to a clean environment, privacy, and healthcare."
  },
  "Article 32": {
    title: "Constitutional Remedies",
    summary: "Allows citizens to move the Supreme Court for the enforcement of Fundamental Rights.",
    significance: "The 'Heart and Soul' of the Constitution. Without this, fundamental rights are just words on paper."
  },
  "Article 25": {
    title: "Religious Freedom",
    summary: "Freedom of conscience and the right to practice and propagate religion.",
    significance: "Maintains India's secular fabric."
  }
};

export const MOVES_COLLECTION: Record<string, Move> = {
  WRIT_STRIKE: {
    name: "WRIT STRIKE",
    article: "Article 32",
    power: 35,
    animationClass: 'vfx-slash',
    description: "A sharp legal challenge that strikes directly at unconstitutional actions."
  },
  DIGNITY_WAVE: {
    name: "DIGNITY WAVE",
    article: "Article 21",
    power: 25,
    animationClass: 'vfx-pulse',
    description: "A wave of justice that restores the inherent dignity of all persons."
  },
  EQUALITY_BEAM: {
    name: "EQUALITY BEAM",
    article: "Article 14",
    power: 30,
    animationClass: 'vfx-beam',
    description: "A concentrated ray of light that ensures everyone is equal before the law."
  },
  LIBERTY_LUNGE: {
    name: "LIBERTY LUNGE",
    article: "Article 19",
    power: 20,
    animationClass: 'animate-lunge',
    description: "A swift physical and legal move that breaks through the barriers of censorship."
  },
  SECULAR_BOLT: {
    name: "SECULAR BOLT",
    article: "Article 25",
    power: 15,
    animationClass: 'vfx-bolt',
    description: "A strike that protects the freedom of conscience and religious practice."
  }
};

export const WORLD_SIZE = 25;
export const TILE_SIZE = 48;

export const SPRITES = {
  PLAYER_MALE_FRONT: "https://i.postimg.cc/Jz82YdmH/ash.png",
  PLAYER_MALE_WALK: "https://i.postimg.cc/W4cgPmZm/dacytqk_34dc4bfd_fcdb_4551_924c_23bdfb66a911.gif",
  PLAYER_FEMALE_FRONT: "https://i.postimg.cc/t4bMvmyg/misty_lgpe.png",
  PLAYER_FEMALE_WALK: "https://i.postimg.cc/KYhBy7TP/dadc3rp_505fbf9c_b115_41ee_a519_2454387e17a8.gif",
  NPC_1: "https://i.postimg.cc/13Sj7YPg/backersf.png",
  NPC_2: "https://i.postimg.cc/mg45p6RF/blackbelt_gen4.png",
  
  PIKACHU_FRONT: "https://i.postimg.cc/JtC4B0xf/pikachu_sinnohcap.gif",
  PIKACHU_BACK: "https://i.postimg.cc/Gtym2GPr/pikachu_kaloscap.gif",

  PIDGEOT_FRONT: "https://i.postimg.cc/mD0vF9Y9/pidgeot.gif",
  PIDGEOT_BACK: "https://i.postimg.cc/qgHMCqwS/pidgeot-(1).gif",
  
  BULBASAUR_FRONT: "https://i.postimg.cc/9F2V9VpW/bulbasaur.gif",
  SQUIRTLE_FRONT: "https://i.postimg.cc/Ssd7K6rV/squirtle.gif",
  
  CHARIZARD_FRONT: "https://i.postimg.cc/9zHFq012/charizard.gif",
  GYARADOS_FRONT: "https://i.postimg.cc/RCKd6FS5/gyarados.gif",
  MEWTWO_FRONT: "https://i.postimg.cc/2jhGb6zX/mewtwo_(1).gif",
  
  COURT: "🏛️",
  HOUSE: "🏘️",
  SIGN: "🪧",
};

const RAW_MAP = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,1,1,1,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,1,1,1,0,4],
  [4,0,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,1,1,1,0,4],
  [4,0,1,1,1,0,0,2,0,0,0,2,2,2,0,0,0,2,0,0,1,1,1,0,4],
  [4,0,0,0,0,0,0,2,0,0,0,2,2,2,0,0,0,2,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,2,0,0,0,2,2,2,0,0,0,2,0,0,0,0,0,0,4],
  [4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4],
  [4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4],
  [4,0,0,0,0,0,0,2,0,0,0,2,2,2,0,0,0,2,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,2,0,3,3,2,2,2,3,3,0,2,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,2,0,3,3,2,2,2,3,3,0,2,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,2,0,0,0,2,2,2,0,0,0,2,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,4],
  [4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4],
  [4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4],
  [4,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,4],
  [4,1,1,1,1,1,1,1,1,1,0,2,2,2,0,1,1,1,1,1,1,1,1,1,4],
  [4,1,1,1,1,1,1,1,1,1,0,2,2,2,0,1,1,1,1,1,1,1,1,1,4],
  [4,1,1,1,1,1,1,1,1,1,0,2,2,2,0,1,1,1,1,1,1,1,1,1,4],
  [4,1,1,1,1,1,1,1,1,1,0,2,2,2,0,1,1,1,1,1,1,1,1,1,4],
  [4,1,1,1,1,1,1,1,1,1,0,2,2,2,0,1,1,1,1,1,1,1,1,1,4],
  [4,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
];

export const TOWN_MAP: TileType[][] = RAW_MAP.map(row => row.map(cell => {
  switch(cell) {
    case 0: return 'GRASS';
    case 1: return 'TALL_GRASS';
    case 2: return 'PATH';
    case 3: return 'WATER';
    case 4: return 'WALL';
    default: return 'GRASS';
  }
}));

export const INITIAL_PARTY: ConstitutionalPokemon[] = [
  {
    name: "PIKACHU",
    nickname: "JUSTICE",
    level: 25,
    hp: 150,
    maxHp: 150,
    frontSprite: SPRITES.PIKACHU_FRONT,
    backSprite: SPRITES.PIKACHU_BACK,
    moves: [
      MOVES_COLLECTION.WRIT_STRIKE,
      MOVES_COLLECTION.EQUALITY_BEAM,
      MOVES_COLLECTION.DIGNITY_WAVE,
      MOVES_COLLECTION.LIBERTY_LUNGE
    ]
  },
  {
    name: "PIDGEOT",
    nickname: "FEDERALIST",
    level: 28,
    hp: 180,
    maxHp: 180,
    frontSprite: SPRITES.PIDGEOT_FRONT,
    backSprite: SPRITES.PIDGEOT_BACK,
    moves: [
      MOVES_COLLECTION.LIBERTY_LUNGE,
      MOVES_COLLECTION.WRIT_STRIKE,
      MOVES_COLLECTION.SECULAR_BOLT,
      MOVES_COLLECTION.EQUALITY_BEAM
    ]
  }
];

export const npcs: NPC[] = [
  {
    id: 'npc1',
    name: 'CITIZEN',
    x: 14,
    y: 8,
    spriteUrl: SPRITES.NPC_1,
    dialogue: ["Beware the Distortions in the tall grass!", "They twist our rights. Only an Advocate can stop them."],
  },
  {
    id: 'npc2',
    name: 'ADVOCATE',
    x: 12,
    y: 10,
    spriteUrl: SPRITES.NPC_2,
    dialogue: ["To win a battle, use moves that match the violation.", "Article 14 is for equality, Article 19 is for freedom."],
  }
];