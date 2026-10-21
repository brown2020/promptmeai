import { useEffect, useState } from "react";

const useTypingEffect = (text: string, speed: number): string => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [typedFrom, setTypedFrom] = useState(text);

  if (typedFrom !== text) {
    setTypedFrom(text);
    setDisplayedText("");
  }

  useEffect(() => {
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1)); // Slice text based on the index
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [text, speed]);

  return displayedText;
};

export default useTypingEffect;
