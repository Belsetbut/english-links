"use client";

import { useEffect, useRef, useState } from 'react';

export default function Secret() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const bird = useRef({ y: 150, velocity: 0 });
  const pipes = useRef<{ x: number; height: number }[]>([]);
const gameLoopRef = useRef<number>(0); 

  const jump = () => {
    bird.current.velocity = -8;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update bird
      bird.current.velocity += 0.5;
      bird.current.y += bird.current.velocity;

      // Draw bird
      ctx.fillStyle = 'yellow';
      ctx.fillRect(50, bird.current.y, 30, 30);

      // Update and draw pipes
      if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < canvas.width - 200) {
        pipes.current.push({
          x: canvas.width,
          height: Math.random() * (canvas.height - 200) + 100,
        });
      }

      pipes.current.forEach((pipe) => {
        pipe.x -= 2;

        // Draw pipes
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, 50, pipe.height - 100);
        ctx.fillRect(pipe.x, pipe.height + 100, 50, canvas.height);

        // Collision detection
        if (
          50 < pipe.x + 50 &&
          50 + 30 > pipe.x &&
          (bird.current.y < pipe.height - 100 || bird.current.y + 30 > pipe.height + 100)
        ) {
          setGameOver(true);
        }

        // Score
        if (pipe.x === 48) {
          setScore(prev => prev + 1);
        }
      });

      // Remove off-screen pipes
      pipes.current = pipes.current.filter(pipe => pipe.x > -50);

      // Check boundaries
      if (bird.current.y > canvas.height || bird.current.y < 0) {
        setGameOver(true);
      }

      if (!gameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('click', jump);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('click', jump);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameOver]);

  const restartGame = () => {
    bird.current = { y: 150, velocity: 0 };
    pipes.current = [];
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="text-white mb-4">Score: {score}</div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-white"
      />
      {gameOver && (
        <button
          onClick={restartGame}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Play Again
        </button>
      )}
      <div className="text-white mt-4">
        Press SPACE or click to jump
      </div>
    </div>
  );
}