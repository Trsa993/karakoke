import { useState, useEffect } from "react";
import { useGlobalContext } from "../components/GlobalProvider";

const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);
  const { isSearchFocused } = useGlobalContext();

  useEffect(() => {
    const downHandler = (event) => {
      if (event.key === targetKey) {
        if (
          targetKey === "ArrowDown" ||
          targetKey === "ArrowUp" ||
          (!isSearchFocused && targetKey === " ")
        ) {
          event.preventDefault();
        }
        setKeyPressed(true);
      }
    };
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey, isSearchFocused]);

  return keyPressed;
};

export default useKeyPress;
