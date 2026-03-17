'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DailyDataContextType {
  intakeCalories: number;
  setIntakeCalories: (calories: number) => void;
  expenditureCalories: number;
  setExpenditureCalories: (calories: number) => void;
}

const DailyDataContext = createContext<DailyDataContextType | undefined>(undefined);

export const DailyDataProvider = ({ children }: { children: ReactNode }) => {
  const [intakeCalories, setIntakeCalories] = useState(0);
  const [expenditureCalories, setExpenditureCalories] = useState(0);

  return (
    <DailyDataContext.Provider value={{ intakeCalories, setIntakeCalories, expenditureCalories, setExpenditureCalories }}>
      {children}
    </DailyDataContext.Provider>
  );
};

export const useDailyData = () => {
  const context = useContext(DailyDataContext);
  if (context === undefined) {
    throw new Error('useDailyData must be used within a DailyDataProvider');
  }
  return context;
};
