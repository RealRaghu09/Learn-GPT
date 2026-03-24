import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [finalData, setFinalData] = useState("");

  return (
    <DataContext.Provider value={{ finalData, setFinalData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}