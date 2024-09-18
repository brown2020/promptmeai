import { useState, useEffect } from "react";

const useIsClient = (): boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // The effect runs after the component mounts, confirming it's on the client.
    setIsClient(true);
  }, []);

  return isClient;
};

export default useIsClient;
