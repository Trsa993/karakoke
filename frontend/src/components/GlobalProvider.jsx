import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  return (
    <GlobalContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
