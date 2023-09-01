import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const getVolumeOrDefault = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? parseFloat(storedValue) : defaultValue;
  };

  const [volume, setVolumeState] = useState(getVolumeOrDefault("volume", 1));

  const [previousVolume, setPreviousVolumeState] = useState(
    getVolumeOrDefault("previousVolume", 1)
  );

  const [vocalsVolume, setVocalsVolumeState] = useState(
    getVolumeOrDefault("vocalsVolume", 1)
  );

  const setVolume = (value) => {
    setVolumeState(value);
    localStorage.setItem("volume", value);
  };

  const setPreviousVolume = (value) => {
    setPreviousVolumeState(value);
    localStorage.setItem("previousVolume", value);
  };

  const setVocalsVolume = (value) => {
    setVocalsVolumeState(value);
    localStorage.setItem("vocalsVolume", value);
  };

  return (
    <GlobalContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
        isSearchFocused,
        setIsSearchFocused,
        volume,
        setVolume,
        previousVolume,
        setPreviousVolume,
        vocalsVolume,
        setVocalsVolume,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
