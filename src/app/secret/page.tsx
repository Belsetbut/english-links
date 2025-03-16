"use client";

import { useEffect, useRef, useState } from "react";

export default function Secret() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const lastTime = useRef<number>(0);

  const bird = useRef({ y: 150, velocity: 0 });
  const pipes = useRef<{ x: number; height: number }[]>([]);
  const gameLoopRef = useRef<number>(0);

  useEffect(() => {
    // Set canvas size based on screen
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = Math.min(800, window.innerWidth - 20);
      canvasRef.current.height = Math.min(400, window.innerHeight - 100);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      if (!canvas || !ctx) return;

      // Calculate delta time for consistent speed across devices
      const deltaTime = timestamp - (lastTime.current || timestamp);
      lastTime.current = timestamp;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update bird with deltaTime
      bird.current.velocity += 0.3 * (deltaTime / 16); // Normalized gravity
      bird.current.y += bird.current.velocity * (deltaTime / 16);

      // Draw bird (scaled for mobile)
      const birdSize = Math.min(30, canvas.width / 20);
      ctx.fillStyle = "yellow";
      ctx.fillRect(50, bird.current.y, birdSize, birdSize);

      // Update and draw pipes
      const gapSize = canvas.height / 3;
      const pipeWidth = Math.min(50, canvas.width / 12);

      if (
        pipes.current.length === 0 ||
        pipes.current[pipes.current.length - 1].x < canvas.width - 200
      ) {
        pipes.current.push({
          x: canvas.width,
          height: Math.random() * (canvas.height - gapSize - 100) + 100,
        });
      }

      pipes.current.forEach((pipe) => {
        pipe.x -= 2 * (deltaTime / 16); // Normalized speed

        // Draw pipes
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height - gapSize / 2);
        ctx.fillRect(
          pipe.x,
          pipe.height + gapSize / 2,
          pipeWidth,
          canvas.height
        );

        // Collision detection
        if (
          50 < pipe.x + pipeWidth &&
          50 + birdSize > pipe.x &&
          (bird.current.y < pipe.height - gapSize / 2 ||
            bird.current.y + birdSize > pipe.height + gapSize / 2)
        ) {
          setGameOver(true);
        }

        // Score
        if (pipe.x === 48) {
          setScore((prev) => prev + 1);
        }
      });

      pipes.current = pipes.current.filter((pipe) => pipe.x > -pipeWidth);

      if (bird.current.y > canvas.height || bird.current.y < 0) {
        setGameOver(true);
      }

      if (!gameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    const jump = () => {
      bird.current.velocity = -6;
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent page scrolling
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    canvas.addEventListener("click", jump);
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      jump();
    });

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("keydown", handleKeyPress);
      canvas.removeEventListener("click", jump);
      canvas.removeEventListener("touchstart", jump);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameOver]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-2">
      <div className="text-white mb-4 text-xl">Score: {score}</div>
      <canvas ref={canvasRef} className="border border-white touch-none" />
      {gameOver && (
        <button
          onClick={() => {
            bird.current = { y: 150, velocity: 0 };
            pipes.current = [];
            setGameOver(false);
            setScore(0);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Play Again
        </button>
      )}
      <div className="text-white mt-4 text-center">
        Press SPACE or tap to jump
      </div>
    </div>
  );
}
