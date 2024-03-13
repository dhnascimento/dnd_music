import React, { useState, useEffect, useRef } from "react";
import TextBox from "./TextBox";

export default function InfiniteCorridor() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [allParagraphsTyped, setAllParagraphsTyped] = useState(false);
  const corridorRef = useRef(null);

  const paragraphs = [
    "This is the first paragraph to be typed with the typewriter effect.",
    "Here comes the second paragraph, continuing the JRPG style text box experience.",
    "Feel free to add as many paragraphs as you need for your narrative!",
  ];

  const handleStartTyping = () => {
    setIsTyping(true);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const corridor = corridorRef.current;
    if (isPlaying) {
      corridor.style.animationPlayState = "running";
    } else {
      corridor.style.animationPlayState = "paused";
    }

    return () => (corridor.style.animationPlayState = "paused");
  }, [isPlaying]);

  return (
    <>
      <div
        ref={corridorRef}
        className={isMobile ? "corridorMobile" : "corridor"}
      >
        <h1 id="title__start">Welcome to the Magic Beats Dungeon!</h1>
        <div id="hud__wrapper">
          <TextBox
            paragraphs={paragraphs}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
            allParagraphsTyped={allParagraphsTyped}
            setAllParagraphsTyped={setAllParagraphsTyped}
          />
          <button className="btn__primary" onClick={handleStartTyping}>
            Start
          </button>
        </div>
      </div>
    </>
  );
}
