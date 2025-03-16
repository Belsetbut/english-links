"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [text, setText] = useState("");
  const fullText = "Example Links";
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

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
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8">
        {text}
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
      </h1>
      <div className="flex flex-col gap-4">
        <Link
          href="https://en.wikipedia.org/wiki/Education_in_Germany"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          target="_blank">
          Example 1
        </Link>
        <Link
          href="https://google.com"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          target="_blank">
          Google
        </Link>
        <Link
          href="https://twitter.com"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          target="_blank">
          Twitter
        </Link>
      </div>
    </main>
  );
}
