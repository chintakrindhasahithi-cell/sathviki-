import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  const lastProcessedDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver) return;

      const currentDir = lastProcessedDirectionRef.current;
      let newDir = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
      }
      directionRef.current = newDir;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        lastProcessedDirectionRef.current = currentDir;

        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, score, onScoreChange, generateFood]);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-gray-900/50 rounded-2xl neon-border-cyan backdrop-blur-sm w-full max-w-lg mx-auto">
      {/* Game Board */}
      <div 
        className="grid bg-black/80 border border-gray-800 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.2)]"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: '100%',
          aspectRatio: '1 / 1'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                w-full h-full border-[0.5px] border-gray-900/30
                ${isHead ? 'neon-bg-pink z-10 rounded-sm' : ''}
                ${isSnake && !isHead ? 'bg-pink-500/80 shadow-[0_0_10px_rgba(255,0,255,0.5)] rounded-sm' : ''}
                ${isFood ? 'neon-bg-green rounded-full scale-75' : ''}
              `}
            />
          );
        })}
      </div>

      {/* Overlays */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm z-20">
          <h2 className="text-4xl font-bold neon-text-pink mb-4">GAME OVER</h2>
          <p className="text-xl text-cyan-400 mb-6">Final Score: {score}</p>
          <button 
            onClick={resetGame}
            className="px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-400/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all cursor-pointer"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl backdrop-blur-sm z-20">
          <h2 className="text-4xl font-bold neon-text-cyan tracking-widest">PAUSED</h2>
          <p className="text-gray-400 mt-2">Press SPACE to resume</p>
        </div>
      )}
      
      <div className="mt-6 text-gray-400 text-sm flex gap-4">
        <span><kbd className="bg-gray-800 px-2 py-1 rounded text-cyan-300 border border-gray-700">WASD</kbd> or <kbd className="bg-gray-800 px-2 py-1 rounded text-cyan-300 border border-gray-700">Arrows</kbd> to move</span>
        <span><kbd className="bg-gray-800 px-2 py-1 rounded text-pink-300 border border-gray-700">SPACE</kbd> to pause</span>
      </div>
    </div>
  );
}
