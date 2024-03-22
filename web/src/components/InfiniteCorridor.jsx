import React, { useState, useEffect, useRef } from "react";
import TextBox from "./TextBox";

export default function InfiniteCorridor({
  hasStarted,
  handleStartJourney,
  isPlaying,
  setIsPlaying,
  currentStage,
  stageData,
  isTyping,
  typedParagraphs,
  setTypedParagraphs,
  setAllParagraphsTyped,
  allParagraphsTyped,
  handleTyping,
  setCurrentStage,
  setMockCode
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const corridorRef = useRef(null);

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
    if (!corridor) return;

    const restartAnimation = () => {
      corridor.style.animationName = "none";
      setTimeout(() => {
        corridor.style.animationName = "play"; // Assuming "play" is the name of your animation
      }, 50);
    };

    if (isPlaying) {
      corridor.style.animationPlayState = "running";
      restartAnimation();
    } else {
      corridor.style.animationPlayState = "paused";
    }


    const handleAnimationEnd = () => {
      setCurrentStage(prevStage => prevStage + 1);
      setIsPlaying(false);
      if (stageData.setCode) {
        console.log('setting mock code to true');
        setMockCode(true);
      }
      setTypedParagraphs(() => new Array(stageData.paragraphs.length).fill(false));
      handleTyping();
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
        {hasStarted && !isPlaying && (
          <div id="hud__wrapper">
            <TextBox
              paragraphs={stageData.paragraphs}
              isTyping={isTyping}
              handleTyping={handleTyping}
              setTypedParagraphs={setTypedParagraphs}
              typedParagraphs={typedParagraphs}
              setAllParagraphsTyped={setAllParagraphsTyped}
              allParagraphsTyped={allParagraphsTyped}
            />
            <div className="btn__wrapper">
              {allParagraphsTyped && (
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
