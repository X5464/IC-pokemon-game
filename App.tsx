import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GameState, Move, Opponent, NPC, ConstitutionalPokemon, GameProgress } from './types';
import { TILE_SIZE, WORLD_SIZE, SPRITES, INITIAL_PARTY, npcs, TOWN_MAP, ARTICLE_DETAILS } from './constants';

const SAVE_KEY = "samvidhan_quest_v24_final_enhancement";

const App: React.FC = () => {
  // Game Meta
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [trainerType, setTrainerType] = useState<'RED' | 'LEAF'>('RED');

  // Overworld State
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [playerPos, setPlayerPos] = useState({ x: 12, y: 12 });
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressedKeys = useRef<Set<string>>(new Set());

  // Interaction State
  const [dialogue, setDialogue] = useState<string[]>([]);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState(0);
  
  // Battle State
  const [party, setParty] = useState<ConstitutionalPokemon[]>(INITIAL_PARTY);
  const [activePkmnIndex, setActivePkmnIndex] = useState(0);
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [battleLog, setBattleLog] = useState<string>("");
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [battleMenuMode, setBattleMenuMode] = useState<'ROOT' | 'FIGHT' | 'TEAM'>('ROOT');
  const [cursorPos, setCursorPos] = useState(0);
  const [battleBgType, setBattleBgType] = useState<'grass' | 'court' | 'indoor'>('grass');

  // Animation State
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [vfx, setVfx] = useState<string | null>(null);
  const [vfxTarget, setVfxTarget] = useState<'player' | 'enemy' | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [isLungeActive, setIsLungeActive] = useState(false);
  const [isWithdrawActive, setIsWithdrawActive] = useState(false);
  const [faintTarget, setFaintTarget] = useState<'player' | 'enemy' | null>(null);
  const [flashTarget, setFlashTarget] = useState<'player' | 'enemy' | null>(null);
  const [captureStage, setCaptureStage] = useState<null | 'throwing' | 'shaking' | 'success' | 'fail'>(null);
  const [isCaptureSucking, setIsCaptureSucking] = useState(false);
  const [pkmnSummoned, setPkmnSummoned] = useState(false);
  const [summonStage, setSummonStage] = useState<null | 'throwing'>(null);
  const [trainerActive, setTrainerActive] = useState(false);
  const [trainerSlidingOut, setTrainerSlidingOut] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  const activePkmn = useMemo(() => party[activePkmnIndex], [party, activePkmnIndex]);

  // Load / Save
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const progress: GameProgress = JSON.parse(saved);
        if (progress.party) setParty(progress.party);
        if (progress.playerPos) setPlayerPos(progress.playerPos);
        if (progress.trainerType) setTrainerType(progress.trainerType);
        if (progress.lastSaved) setLastSaved(progress.lastSaved);
      } catch (e) { console.error("Load error", e); }
    }
  }, []);

  const saveGame = useCallback(() => {
    setIsSaving(true);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const progress: GameProgress = {
      level, score, completedLevels, party, playerPos, lastSaved: time, trainerType
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
    setLastSaved(time);
    setTimeout(() => setIsSaving(false), 1000);
  }, [level, score, completedLevels, party, playerPos, trainerType]);

  // Autosave
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState === GameState.OVERWORLD) {
        saveGame();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [gameState, saveGame]);

  // Battle Logic
  const startBattle = useCallback(() => {
    setIsShutterActive(true);
    const tile = TOWN_MAP[playerPos.y][playerPos.x];
    let bg: 'grass' | 'court' | 'indoor' = 'indoor';
    if (tile === 'TALL_GRASS' || tile === 'GRASS') bg = 'grass';
    else if (tile === 'PATH' || tile === 'DIRT') bg = 'court';
    setBattleBgType(bg);

    setCaptureStage(null);
    setIsCaptureSucking(false);
    setFaintTarget(null);
    setVfx(null);
    setFlashTarget(null);
    setScreenShake(false);
    setIsLungeActive(false);
    setIsWithdrawActive(false);
    setShakeCount(0);

    setTimeout(() => {
      const distortions = [
        { name: "CENSOR GHOST", sprite: SPRITES.CHARIZARD_FRONT, weakness: "Article 19", arg: "WORDS MUST BE CONTROLLED!" },
        { name: "CASTE DEMON", sprite: SPRITES.GYARADOS_FRONT, weakness: "Article 14", arg: "LINEAGE IS THE ONLY LAW!" },
        { name: "TYRANT SOUL", sprite: SPRITES.MEWTWO_FRONT, weakness: "Article 32", arg: "NO ONE CAN QUESTION ME!" }
      ];
      const picked = distortions[Math.floor(Math.random() * distortions.length)];
      setGameState(GameState.BATTLE);
      setPkmnSummoned(false);
      setSummonStage(null);
      setTrainerActive(true);
      setTrainerSlidingOut(false);
      setOpponent({ name: picked.name, health: 140, maxHealth: 140, argument: picked.arg, weakness: picked.weakness, spriteUrl: picked.sprite });
      setBattleLog(`Wild ${picked.name} appeared!`);
      setIsPlayerTurn(false);
      setBattleMenuMode('ROOT');
      setCursorPos(0);
      setIsShutterActive(false);

      setTimeout(() => {
        setBattleLog(`${picked.name}: "${picked.arg}"`);
        setTimeout(() => {
          setTrainerSlidingOut(true);
          setTimeout(() => {
            setTrainerActive(false);
            setSummonStage('throwing');
            setTimeout(() => {
              setSummonStage(null);
              setPkmnSummoned(true);
              setBattleLog(`Go! ${activePkmn.name}! Restore the Articles!`);
              setIsPlayerTurn(true);
            }, 600);
          }, 500);
        }, 1500);
      }, 1000);
    }, 600);
  }, [playerPos, activePkmn]);

  const executeEnemyTurn = () => {
    if (!opponent || faintTarget) return;
    setBattleLog(`${opponent.name} used Distortion Blast!`);
    
    setTimeout(() => {
      setVfx('vfx-bolt');
      setVfxTarget('player');
      
      setTimeout(() => {
        setVfx(null);
        setFlashTarget('player');
        setScreenShake(true);
        const dmg = 40 + Math.floor(Math.random() * 15);
        
        setParty(prev => prev.map((p, i) => i === activePkmnIndex ? { ...p, hp: Math.max(0, p.hp - dmg) } : p));
        
        setTimeout(() => {
          setFlashTarget(null);
          setScreenShake(false);
          const currentHp = activePkmn.hp - dmg;
          if (currentHp <= 0) {
            setBattleLog(`${activePkmn.name} was defeated by Injustice!`);
            setFaintTarget('player');
            setTimeout(() => {
              setGameState(GameState.OVERWORLD);
              setParty(INITIAL_PARTY.map(p => ({ ...p, hp: p.maxHp }))); 
            }, 2000);
          } else {
            setIsPlayerTurn(true);
            setBattleLog(`What will ${activePkmn.name} do?`);
          }
        }, 400);
      }, 500);
    }, 1000);
  };

  const executeMove = (move: Move) => {
    if (!isPlayerTurn || !opponent || faintTarget) return;
    setIsPlayerTurn(false);
    setBattleMenuMode('ROOT');
    setBattleLog(`${activePkmn.name} used ${move.name}!`);
    
    setTimeout(() => {
      setVfxTarget('enemy');
      if (move.animationClass === 'animate-lunge') {
        setIsLungeActive(true);
      } else {
        setVfx(move.animationClass);
      }

      setTimeout(() => {
        setIsLungeActive(false);
        setVfx(null);
        setFlashTarget('enemy');
        setScreenShake(true);
        
        const isEffective = move.article === opponent.weakness;
        const totalDamage = isEffective ? move.power * 2.5 : move.power;
        const newHealth = Math.max(0, opponent.health - totalDamage);
        
        setOpponent(prev => prev ? { ...prev, health: newHealth } : null);
        setBattleLog(isEffective ? `Highly Constitutional! (${move.article})` : `Order served! (${move.article})`);

        setTimeout(() => {
          setFlashTarget(null);
          setScreenShake(false);
          if (newHealth <= 0) {
            setBattleLog(`${opponent.name} was successfully rectified!`);
            setFaintTarget('enemy');
            setTimeout(() => setGameState(GameState.OVERWORLD), 2000);
          } else {
            executeEnemyTurn();
          }
        }, 500);
      }, 600);
    }, 500);
  };

  const executeCapture = () => {
    if (!isPlayerTurn || !opponent || faintTarget) return;
    setIsPlayerTurn(false);
    setBattleMenuMode('ROOT');
    setBattleLog(`Applying the Writ of Justice!`);
    setCaptureStage('throwing');

    setTimeout(() => {
      setIsCaptureSucking(true);
      setCaptureStage('shaking');
      
      let count = 0;
      const shakeInterval = setInterval(() => {
        count++;
        setShakeCount(count);
        if (count >= 3) {
          clearInterval(shakeInterval);
          finalizeCapture();
        }
      }, 600);

      const finalizeCapture = () => {
        const hpRatio = opponent.health / opponent.maxHealth;
        const catchChance = 0.15 + (1 - hpRatio) * 0.75;
        const success = Math.random() < catchChance;

        setTimeout(() => {
          if (success) {
            setCaptureStage('success');
            setBattleLog(`Gotcha! ${opponent.name} archived!`);
            setTimeout(() => setGameState(GameState.OVERWORLD), 2200);
          } else {
            setCaptureStage('fail');
            setTimeout(() => {
              setIsCaptureSucking(false); 
              setBattleLog(`The Distortion broke free!`);
              setTimeout(() => {
                setCaptureStage(null);
                setShakeCount(0);
                executeEnemyTurn();
              }, 1200);
            }, 500);
          }
        }, 500);
      };
    }, 600);
  };

  const executeSwitch = (index: number) => {
    if (index === activePkmnIndex) return;
    if (party[index].hp <= 0) {
      setBattleLog(`${party[index].name} is exhausted!`);
      return;
    }

    setIsPlayerTurn(false);
    setBattleMenuMode('ROOT');
    setBattleLog(`Come back, ${activePkmn.name}!`);
    setIsWithdrawActive(true);

    setTimeout(() => {
      setIsWithdrawActive(false);
      setPkmnSummoned(false);
      setActivePkmnIndex(index);
      setSummonStage('throwing');
      setTimeout(() => {
        setSummonStage(null);
        setPkmnSummoned(true);
        setBattleLog(`Go! ${party[index].name}!`);
        setTimeout(() => executeEnemyTurn(), 800);
      }, 600);
    }, 500);
  };

  const handleAction = useCallback((action: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'A' | 'B' | 'START') => {
    if (gameState === GameState.INTRO) {
      if (action === 'LEFT' || action === 'RIGHT') setTrainerType(p => p === 'RED' ? 'LEAF' : 'RED');
      if (action === 'A' || action === 'START') setGameState(GameState.TUTORIAL);
      return;
    }
    if (gameState === GameState.TUTORIAL && (action === 'A' || action === 'START')) {
      setGameState(GameState.OVERWORLD);
      return;
    }
    if (gameState === GameState.DIALOGUE && (action === 'A' || action === 'START')) {
      if (currentDialogueIdx < dialogue.length - 1) setCurrentDialogueIdx(i => i + 1);
      else setGameState(GameState.OVERWORLD);
      return;
    }

    if (gameState === GameState.BATTLE && isPlayerTurn) {
      if (battleMenuMode === 'ROOT') {
        switch(action) {
          case 'UP': setCursorPos(p => (p - 1 + 4) % 4); break;
          case 'DOWN': setCursorPos(p => (p + 1) % 4); break;
          case 'A': 
            if (cursorPos === 0) { setBattleMenuMode('FIGHT'); setCursorPos(0); }
            else if (cursorPos === 1) { setBattleMenuMode('TEAM'); setCursorPos(0); }
            else if (cursorPos === 2) executeCapture();
            else if (cursorPos === 3) {
              // RUN COMMAND WITH ANIMATION
              setIsPlayerTurn(false);
              setBattleLog(`Withdrawing ${activePkmn.name}... Escaping!`);
              setIsWithdrawActive(true);
              setTimeout(() => {
                setPkmnSummoned(false);
                setIsWithdrawActive(false);
                setTimeout(() => setGameState(GameState.OVERWORLD), 400);
              }, 600);
            }
            break;
        }
      } else if (battleMenuMode === 'FIGHT') {
        const moveCount = activePkmn.moves.length;
        switch(action) {
          case 'UP': setCursorPos(p => (p - 1 + moveCount) % moveCount); break;
          case 'DOWN': setCursorPos(p => (p + 1) % moveCount); break;
          case 'B': setBattleMenuMode('ROOT'); setCursorPos(0); break;
          case 'A': executeMove(activePkmn.moves[cursorPos]); break;
        }
      } else if (battleMenuMode === 'TEAM') {
        const partyCount = party.length;
        switch(action) {
          case 'UP': setCursorPos(p => (p - 1 + partyCount) % partyCount); break;
          case 'DOWN': setCursorPos(p => (p + 1) % partyCount); break;
          case 'B': setBattleMenuMode('ROOT'); setCursorPos(0); break;
          case 'A': executeSwitch(cursorPos); break;
        }
      }
      return;
    }

    if (gameState === GameState.OVERWORLD) {
      const move = (dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') => {
        setDirection(dir);
        setIsMoving(true);
        if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
        moveTimerRef.current = setTimeout(() => setIsMoving(false), 200);

        const nx = Math.max(0, Math.min(WORLD_SIZE-1, playerPos.x + dx));
        const ny = Math.max(0, Math.min(WORLD_SIZE-1, playerPos.y + dy));
        const tile = TOWN_MAP[ny][nx];
        const isImpassable = tile === 'WATER' || tile === 'WALL' || npcs.some(n => n.x === nx && n.y === ny);

        if (isImpassable) return;
        setPlayerPos({ x: nx, y: ny });
        if (tile === 'TALL_GRASS' && Math.random() < 0.12) startBattle();
      };

      switch(action) {
        case 'UP': move(0, -1, 'up'); break;
        case 'DOWN': move(0, 1, 'down'); break;
        case 'LEFT': move(-1, 0, 'left'); break;
        case 'RIGHT': move(1, 0, 'right'); break;
        case 'A': 
          const tx = direction === 'left' ? playerPos.x - 1 : direction === 'right' ? playerPos.x + 1 : playerPos.x;
          const ty = direction === 'up' ? playerPos.y - 1 : direction === 'down' ? playerPos.y + 1 : playerPos.y;
          const npc = npcs.find(n => n.x === tx && n.y === ty);
          if (npc) { setDialogue(npc.dialogue); setCurrentDialogueIdx(0); setGameState(GameState.DIALOGUE); }
          break;
        case 'START': saveGame(); break;
      }
    }
  }, [gameState, playerPos, direction, dialogue, currentDialogueIdx, battleMenuMode, cursorPos, isPlayerTurn, activePkmn, opponent, executeCapture, executeMove, executeSwitch, party, saveGame, startBattle]);

  // Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (pressedKeys.current.has(key)) return;
      pressedKeys.current.add(key);
      if (key === 'arrowup' || key === 'w') handleAction('UP');
      else if (key === 'arrowdown' || key === 's') handleAction('DOWN');
      else if (key === 'arrowleft' || key === 'a') handleAction('LEFT');
      else if (key === 'arrowright' || key === 'd') handleAction('RIGHT');
      else if (key === 'z' || key === ' ') handleAction('A');
      else if (key === 'x') handleAction('B');
      else if (key === 'enter') handleAction('START');
    };
    const handleKeyUp = (e: KeyboardEvent) => pressedKeys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleAction]);

  const trainerSprite = useMemo(() => {
    const isMale = trainerType === 'RED';
    return isMoving ? (isMale ? SPRITES.PLAYER_MALE_WALK : SPRITES.PLAYER_FEMALE_WALK) : (isMale ? SPRITES.PLAYER_MALE_FRONT : SPRITES.PLAYER_FEMALE_FRONT);
  }, [trainerType, isMoving]);

  const battleTrainerSprite = useMemo(() => trainerType === 'RED' ? SPRITES.PLAYER_MALE_FRONT : SPRITES.PLAYER_FEMALE_FRONT, [trainerType]);

  const getHpColor = (hp: number, max: number) => {
    const ratio = hp / max;
    if (ratio > 0.5) return 'hp-green';
    if (ratio > 0.2) return 'hp-yellow';
    return 'hp-red';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden select-none">
      <div className="relative gameboy-container scale-[0.65] sm:scale-100 flex flex-col items-center">
        
        <div className="relative w-[520px] h-[880px] bg-[#cc3333] rounded-[40px] border-[12px] border-[#882222] shadow-[0_50px_0_#441111] p-10 flex flex-col items-center">
          
          <div className="w-full h-[380px] bg-[#333] rounded-xl flex items-center justify-center p-6 relative shadow-inner">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bezel-text whitespace-nowrap text-[10px] uppercase opacity-40 font-bold">Constitutional Matrix Pro</div>
            
            <div className={`w-full h-full gb-screen relative overflow-hidden pixel-border ${screenShake ? 'animate-shake' : ''}`}>
              {isShutterActive && <div className="battle-shutter shutter-active"><div className="shutter-half shutter-top" /><div className="shutter-half shutter-bottom" /></div>}

              {/* INTRO SCREEN */}
              {gameState === GameState.INTRO && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col items-center justify-center p-4">
                  <h1 className="text-[12px] font-black uppercase text-center mb-8 tracking-tighter text-black">Samvidhan Quest</h1>
                  <div className="flex gap-8 mb-8">
                    {['RED', 'LEAF'].map(t => (
                      <div key={t} onClick={() => setTrainerType(t as any)} className={`p-4 border-4 transition-all ${trainerType === t ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent opacity-40'}`}>
                        <img src={t === 'RED' ? SPRITES.PLAYER_MALE_FRONT : SPRITES.PLAYER_FEMALE_FRONT} className="w-16 h-16 object-contain" />
                      </div>
                    ))}
                  </div>
                  <div className="animate-pulse text-[10px] text-blue-600 uppercase font-black">Press Z to Explore</div>
                </div>
              )}

              {/* TUTORIAL SCREEN */}
              {gameState === GameState.TUTORIAL && (
                <div className="absolute inset-0 z-[110] bg-white p-6 flex flex-col items-center overflow-y-auto text-black">
                  <h2 className="text-[10px] font-black uppercase text-blue-800 mb-4 border-b-2 border-black w-full text-center">Constitution Guide</h2>
                  <div className="text-[7px] uppercase leading-relaxed text-left space-y-4 font-bold">
                    <p><span className="text-red-700 font-black">Controls:</span> Use Arrows to move. Press Z to talk. X to go back.</p>
                    <p><span className="text-red-700 font-black">Tall Grass:</span> Contains "Distortions"—manifestations of illegal claims.</p>
                    <p><span className="text-red-700 font-black">Strategy:</span> Match the Article of your move to the violation.</p>
                    <p><span className="text-red-700 font-black">Capture:</span> Use 'Writ Ball' on weak enemies to neutralize them.</p>
                  </div>
                  <div className="mt-8 animate-pulse text-blue-600 text-[8px] font-black">Press Z to Defend Justice</div>
                </div>
              )}

              {/* BATTLE SCREEN */}
              {gameState === GameState.BATTLE && opponent && (
                <div className={`absolute inset-0 battle-bg-${battleBgType} flex flex-col`}>
                  {/* Enemy Side */}
                  <div className="flex h-[45%] p-2 justify-between items-start">
                    <div className="w-[190px] bg-white border-2 border-black p-2 ml-2 shadow-[4px_4px_0_#bbb] text-black z-20">
                      <div className="text-[8px] font-black uppercase truncate">{opponent.name}</div>
                      <div className="hp-container mt-1">
                        <div className={`hp-bar ${getHpColor(opponent.health, opponent.maxHealth)}`} style={{ width: `${(opponent.health/opponent.maxHealth)*100}%` }} />
                      </div>
                      <div className="text-[6px] text-right mt-1 font-bold">{Math.ceil(opponent.health)}/{opponent.maxHealth}</div>
                    </div>
                    <div className="w-[120px] h-[120px] relative">
                      <div className="battle-platform" />
                      {vfxTarget === 'enemy' && vfx && <div className={vfx} />}
                      
                      {captureStage !== 'shaking' && captureStage !== 'success' && captureStage !== 'fail' && !isCaptureSucking && (
                        <img 
                          src={opponent.spriteUrl} 
                          className={`w-full h-full object-contain contrast-125 origin-bottom ${flashTarget === 'enemy' ? 'brightness-200' : ''} ${faintTarget === 'enemy' ? 'animate-faint' : ''}`} 
                        />
                      )}
                      
                      {captureStage === 'throwing' && <div className="absolute top-0 left-0 z-[70] animate-capture-throw"><div className="writ-ball" /></div>}
                      {captureStage === 'shaking' && <div key={shakeCount} className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-[70] animate-ball-shake"><div className="writ-ball" /></div>}
                      {captureStage === 'success' && <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-[70] animate-ball-click"><div className="writ-ball" /></div>}
                      {captureStage === 'fail' && <div className="absolute left-[50%] top-[50%] z-[70] animate-ball-burst"><div className="writ-ball" /></div>}
                    </div>
                  </div>

                  {/* Player Side */}
                  <div className="flex h-[35%] p-2 justify-between items-end">
                    <div className="w-[150px] h-[120px] relative flex items-center justify-center">
                      <div className="battle-platform" />
                      {vfxTarget === 'player' && vfx && <div className={vfx} />}
                      
                      {summonStage === 'throwing' && <div className="absolute z-50 animate-summon-throw"><div className="writ-ball" /></div>}
                      
                      {trainerActive && <img src={battleTrainerSprite} className={`absolute w-full h-full object-contain z-10 origin-bottom ${trainerSlidingOut ? 'animate-slide-out-left' : ''}`} />}
                      {(pkmnSummoned || isWithdrawActive) && (
                        <img 
                          src={activePkmn.backSprite} 
                          key={activePkmnIndex}
                          className={`w-full h-full object-contain scale-[1.3] origin-bottom z-20 ${flashTarget === 'player' ? 'brightness-200' : ''} ${isLungeActive ? 'animate-lunge' : ''} ${faintTarget === 'player' ? 'animate-faint' : ''} ${isWithdrawActive ? 'animate-withdraw' : ''}`} 
                        />
                      )}
                    </div>
                    <div className="w-[190px] bg-white border-2 border-black p-2 mr-2 mb-4 shadow-[4px_4px_0_#bbb] text-black z-20">
                      <div className="text-[8px] font-black uppercase truncate">{activePkmn.name}</div>
                      <div className="hp-container mt-1">
                        <div className={`hp-bar ${getHpColor(activePkmn.hp, activePkmn.maxHp)}`} style={{ width: `${(activePkmn.hp/activePkmn.maxHp)*100}%` }} />
                      </div>
                      <div className="text-[6px] text-right mt-1 font-bold">{activePkmn.hp}/{activePkmn.maxHp}</div>
                    </div>
                  </div>

                  {/* Battle Menu / Log */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-white border-t-4 border-black flex">
                    <div className="w-[55%] border-r-4 border-black p-3 text-[7px] font-black uppercase leading-tight overflow-hidden text-black">
                      {battleLog}
                    </div>
                    <div className="w-[45%] grid grid-cols-1 p-2 bg-[#f0f0f0] text-black">
                      {battleMenuMode === 'ROOT' && ['ACT', 'TEAM', 'WRIT', 'RUN'].map((t, i) => (
                        <div key={t} className={`text-[9px] font-black flex items-center gap-2 ${cursorPos === i ? 'text-blue-700' : 'opacity-60'}`}>
                          {cursorPos === i && '▶'} {t}
                        </div>
                      ))}
                      {battleMenuMode === 'FIGHT' && activePkmn.moves.map((m, i) => (
                        <div key={m.name} className={`text-[6px] font-black leading-tight ${cursorPos === i ? 'text-blue-700' : 'opacity-50'}`}>
                          {cursorPos === i && '▶'} {m.name}
                          {cursorPos === i && <div className="text-[4px] mt-1 text-black font-normal opacity-90 italic">{m.description}</div>}
                        </div>
                      ))}
                      {battleMenuMode === 'TEAM' && party.map((p, i) => (
                        <div key={p.name} className={`text-[8px] font-black flex items-center gap-2 ${cursorPos === i ? (i === activePkmnIndex ? 'text-green-600' : 'text-blue-700') : 'opacity-60'}`}>
                          {cursorPos === i && '▶'} {p.name} {Math.ceil((p.hp/p.maxHp)*100)}%
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* OVERWORLD SCREEN */}
              {(gameState === GameState.OVERWORLD || gameState === GameState.DIALOGUE) && (
                <div className="absolute inset-0">
                  <div className="relative" style={{ transform: `translate(${-(playerPos.x - 4.5) * TILE_SIZE}px, ${-(playerPos.y - 3.5) * TILE_SIZE}px)`, transition: 'transform 0.15s steps(4)' }}>
                    {TOWN_MAP.map((row, y) => row.map((tile, x) => (
                      <div key={`${x}-${y}`} className={`tile tile-${tile}`} style={{ left: x * TILE_SIZE, top: y * TILE_SIZE }} />
                    )))}
                    {npcs.map(n => <div key={n.id} className="absolute w-12 h-12 z-20" style={{ left: n.x * TILE_SIZE, top: n.y * TILE_SIZE }}><img src={n.spriteUrl} className="w-full h-full object-contain" /></div>)}
                    <div className="absolute w-12 h-12 z-30 transition-all duration-200" style={{ left: playerPos.x * TILE_SIZE, top: playerPos.y * TILE_SIZE }}>
                      {/* FIXED Sprite Alignment: Using bottom-0 and flex to ensure they aren't floating within the tile */}
                      <div className="w-full h-full flex items-end justify-center pb-1">
                        <img src={trainerSprite} className={`h-[85%] object-contain ${direction === 'left' ? '-scale-x-100' : ''}`} alt="trainer" />
                      </div>
                    </div>
                  </div>
                  
                  {gameState === GameState.DIALOGUE && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white border-4 border-black p-4 z-40 shadow-2xl text-black">
                      <p className="text-[8px] leading-relaxed uppercase font-black">{dialogue[currentDialogueIdx]}</p>
                      <div className="text-right animate-bounce mt-2 text-[10px]">▼</div>
                    </div>
                  )}

                  {lastSaved && !isSaving && (
                    <div className="absolute top-2 right-2 bg-black/40 px-2 py-1 rounded-sm text-[6px] text-white pointer-events-none">
                      Saved: {lastSaved}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-14 w-full flex justify-between px-8">
            <div className="relative w-40 h-40">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#333] rounded-sm shadow-inner" />
              {['UP', 'DOWN', 'LEFT', 'RIGHT'].map(d => (
                <button 
                  key={d} 
                  onMouseDown={(e) => { e.preventDefault(); handleAction(d as any); }}
                  className={`absolute ${d === 'UP' ? 'top-0 left-14' : d === 'DOWN' ? 'bottom-0 left-14' : d === 'LEFT' ? 'left-0 top-14' : 'right-0 top-14'} w-14 h-14 bg-[#333] shadow-[0_4px_0_#111] btn-press flex items-center justify-center transition-all`}
                >
                  <div className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent ${d==='UP'?'border-b-[12px] border-b-white/20':d==='DOWN'?'border-t-[12px] border-t-white/20':d==='LEFT'?'border-r-[12px] border-r-white/20':d==='RIGHT'?'border-l-[12px] border-l-white/20':''}`} />
                </button>
              ))}
            </div>

            <div className="flex gap-12 rotate-[-20deg] mt-10">
              <div className="flex flex-col items-center gap-2">
                <button 
                  onMouseDown={(e) => { e.preventDefault(); handleAction('B'); }}
                  className="w-20 h-20 bg-[#222] rounded-full border-4 border-[#111] shadow-[0_6px_0_#000] btn-press flex items-center justify-center text-white/40 text-xl font-bold"
                >B</button>
                <div className="text-[10px] uppercase font-bold text-black/40">Cancel</div>
              </div>
              <div className="flex flex-col items-center gap-2 -translate-y-10">
                <button 
                  onMouseDown={(e) => { e.preventDefault(); handleAction('A'); }}
                  className="w-20 h-20 bg-[#222] rounded-full border-4 border-[#111] shadow-[0_6px_0_#000] btn-press flex items-center justify-center text-white/40 text-xl font-bold"
                >A</button>
                <div className="text-[10px] uppercase font-bold text-black/40">Select</div>
              </div>
            </div>
          </div>

          <div className="flex gap-12 mt-16 translate-x-4">
            <div className="flex flex-col items-center gap-2 rotate-[-25deg]">
              <button onMouseDown={(e) => { e.preventDefault(); handleAction('START'); }} className="w-20 h-5 bg-[#555] rounded-full shadow-[0_4px_0_#222] btn-press" />
              <div className="text-[8px] uppercase font-bold text-black/40">Start / Save</div>
            </div>
            <div className="flex flex-col items-center gap-2 rotate-[-25deg]">
              <button className="w-20 h-5 bg-[#555] rounded-full shadow-[0_4px_0_#222] btn-press" />
              <div className="text-[8px] uppercase font-bold text-black/40">Select</div>
            </div>
          </div>
        </div>

        {isSaving && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="liquid-glass rounded-3xl p-8 text-center text-[14px] uppercase font-black text-white shadow-2xl animate-pulse">
              Saving Quest...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;