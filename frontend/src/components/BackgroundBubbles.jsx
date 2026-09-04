import React, { useEffect, useState } from 'react';
import './BackgroundBubbles.css';

const BackgroundBubbles = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generate a fixed number of bubbles
    const bubbleCount = 15;
    const newBubbles = Array.from({ length: bubbleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 80 + 20, // size between 20px and 100px
      left: Math.random() * 100, // random horizontal position
      animationDuration: Math.random() * 10 + 10, // between 10s and 20s
      animationDelay: Math.random() * -20 // random start time
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="bubbles-container">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            animationDuration: `${bubble.animationDuration}s`,
            animationDelay: `${bubble.animationDelay}s`
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundBubbles;
