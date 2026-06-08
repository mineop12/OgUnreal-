import React, { createContext, useContext, ReactNode } from 'react';
import { useData } from '../hooks/useData';

type DataContextType = ReturnType<typeof useData>;

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const data = useData();
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useGlobalData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useGlobalData must be used within a DataProvider');
  }
  return context;
}
