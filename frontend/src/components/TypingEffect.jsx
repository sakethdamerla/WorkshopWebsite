import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, className, enabled = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    if (!enabled) return;

    const handleTyping = () => {
      const i = loopNum % text.length;
      const fullText = text[i];

      setDisplayedText(
        isDeleting
          ? fullText.substring(0, displayedText.length - 1)
          : fullText.substring(0, displayedText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && displayedText === fullText) {
        setTimeout(() => setIsDeleting(true), 500);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [displayedText, isDeleting, loopNum, text, typingSpeed, enabled]);

  if (!enabled) {
    return <h1 className={className}>{text[0]}</h1>;
  }

  return (
    <h1 className={`${className} transition-opacity duration-500`}>
      {displayedText ? displayedText : ' '}
    </h1>
  );
};

export default TypingEffect;