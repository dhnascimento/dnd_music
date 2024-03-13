import React, { useState, useEffect, useRef } from "react";

export default function InfiniteCorridor() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isPlaying, setIsPlaying] = useState(false);
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
          <div className="text_box">
            <p>Welcome, brave something!</p>
            <p>Here begins your quest to discover your inner hero.</p>
          </div>
          <button className="btn__primary" onClick={handleToggleAnimation}>
            Start
          </button>
        </div>
      </div>
    </>
  );
}
