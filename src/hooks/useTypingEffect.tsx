import { useEffect, useState } from "react";

const useTypingEffect = (text: string, speed: number): string => {
  const [displayedText, setDisplayedText] = useState<string>("");

  useEffect(() => {
    setDisplayedText(""); // Reset displayed text on every new `text` input
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
