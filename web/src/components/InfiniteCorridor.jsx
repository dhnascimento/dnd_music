import React, { useState, useEffect, useRef } from "react";
import TextBox from "./TextBox";

export default function InfiniteCorridor({ hasStarted, setHasStarted, currentStage, stageData, setCurrentStage }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [allParagraphsTyped, setAllParagraphsTyped] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const corridorRef = useRef(null);

  const handleStartTyping = () => {
    setIsTyping(!isTyping);
  };

  const handleStartJourney = () => {
    setHasStarted(!hasStarted);
    setIsTyping(!isTyping);
  }

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

    const handleAnimationEnd = () => {
      setCurrentStage(prevStage => prevStage + 1);
      setIsPlaying(!isPlaying);
      setIsTyping(!isTyping);
      setAllParagraphsTyped(!allParagraphsTyped);
    };

    corridor.addEventListener('animationend', handleAnimationEnd);

    return () => {
      corridor.style.animationPlayState = "paused";
      corridor.removeEventListener('animationend', handleAnimationEnd);

    }
  }, [isPlaying]);

  return (
    <>
      <div
        ref={corridorRef}
        className={`${(isMobile ? "corridorMobile" : "corridor")} stage-${currentStage ?? 'none'}`}
      >
        <h1 id="title__start">{stageData.title}</h1>
        {!hasStarted && (
        <button className="btn__primary" onClick={handleStartJourney}>
            Press to Begin your Journey
          </button>
          )}
        {hasStarted && !isPlaying &&    (
        <div id="hud__wrapper">
          <TextBox
            paragraphs={stageData.paragraphs}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
            allParagraphsTyped={allParagraphsTyped}
            setAllParagraphsTyped={setAllParagraphsTyped}
          />
          <div className="btn__wrapper">
          { allParagraphsTyped && (
            <button className="btn__primary" onClick={handleToggleAnimation}>
            {stageData.cta}
            </button>
          )}
          </div>
        </div>
        )}
      </div>
    </>
  );
}
