"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [text, setText] = useState("");
  const fullText = "Example Links";
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [counter, setCounter] = useState(0);
  const router = useRouter();

  // Typewriter effect
  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [index]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    // Hide cursor after 4.5 seconds
    const hideCursorTimer = setTimeout(() => {
      setShowCursor(false);
      clearInterval(cursorInterval);
    }, 4500);

    return () => {
      clearInterval(cursorInterval);
      clearTimeout(hideCursorTimer);
    };
  }, []);

  useEffect(() => {
    if (counter >= 10) {
      router.push('/secret');
    }
  }, [counter, router]);

  const handleTitleClick = () => {
    if (counter < 10) {
      setCounter(prev => prev + 1);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 
        className="text-4xl font-bold mb-8 cursor-pointer" 
        onClick={handleTitleClick}
      >
        {text}
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
      </h1>
      <div className="flex flex-col gap-4">
        <Link
          href="https://en.wikipedia.org/wiki/Education_in_Germany"
          className="text-white hover:text-blue-300 transition-colors flex items-center gap-2 text-xl"
          target="_blank">
          <span>&bull;</span>
          <span className="underline">Example 1</span>
        </Link>
        <Link
          href="https://en.wikipedia.org/wiki/Help:Your_first_article"
          className="text-white hover:text-blue-300 transition-colors flex items-center gap-2 text-xl"
          target="_blank">
          <span>&bull;</span>
          <span className="underline">Example 2</span>
        </Link>
        <Link
          href="https://en.wikipedia.org/wiki/Wikipedia:What_is_an_article%3F#:~:text=A%20Wikipedia%20article%20or%20entry,has%20encyclopedic%20information%20on%20it."
          className="text-white hover:text-blue-300 transition-colors flex items-center gap-2 text-xl"
          target="_blank">
          <span>&bull;</span>
          <span className="underline">Example 3</span>
        </Link>
      </div>
      {counter > 0 && (
        <div className="fixed bottom-4 text-white text-xl">
          {counter}
        </div>
      )}
    </main>
  );
}
