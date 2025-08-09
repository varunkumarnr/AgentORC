"use client";
import { useState, useEffect } from "react";

const words = ["Agile", "Design", "Finance"]; // Array of words

export default function Header() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // This effect will change the word every 2 seconds (you can adjust the timing as needed)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) =>
        prevIndex === words.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="m-4 flex flex-col">
      <h1 className="font-extrabold md:text-4xl self-start red-color">
        AgentORC
      </h1>

      <div className="flex items-center self-start whitespace-nowrap overflow-hidden">
        <p>We are here to help you with </p>

        <p className="animate-typing overflow-hidden whitespace-nowrap border-r-4 ml-1 font-bold">
          <span key={currentWordIndex}>{words[currentWordIndex]}</span>
        </p>
      </div>
    </div>
  );
}
