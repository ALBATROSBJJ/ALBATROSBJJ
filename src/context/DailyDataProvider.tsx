'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types within the provider for centralization
export type Biometrics = {
  gender: 'male' | 'female';
  weight: number;
  height: number;
  age: number;
  activityLevel: number;
};

export type Goal = 'maintain' | 'lose' | 'gain';

export type DailyTargets = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

interface DailyDataContextType {
  intakeCalories: number;
  setIntakeCalories: React.Dispatch<React.SetStateAction<number>>;
  expenditureCalories: number;
  setExpenditureCalories: React.Dispatch<React.SetStateAction<number>>;
  biometrics: Biometrics;
  setBiometrics: React.Dispatch<React.SetStateAction<Biometrics>>;
  goal: Goal;
  setGoal: React.Dispatch<React.SetStateAction<Goal>>;
  dailyTargets: DailyTargets;
  setDailyTargets: React.Dispatch<React.SetStateAction<DailyTargets>>;
}

const DailyDataContext = createContext<DailyDataContextType | undefined>(undefined);

export const DailyDataProvider = ({ children }: { children: ReactNode }) => {
  const [intakeCalories, setIntakeCalories] = useState(0);
  const [expenditureCalories, setExpenditureCalories] = useState(0);

  // Default values from laboratorio/page.tsx
  const [biometrics, setBiometrics] = useState<Biometrics>({
    gender: 'male',
    weight: 84,
    height: 180,
    age: 28,
    activityLevel: 1.55,
  });
  
  // Default values from laboratorio/page.tsx
  const [goal, setGoal] = useState<Goal>('maintain');

  // Default values from dashboard/page.tsx
  const [dailyTargets, setDailyTargets] = useState<DailyTargets>({
    calories: 3200,
    protein: 185,
    carbs: 380,
    fats: 90,
  });

  return (
    <DailyDataContext.Provider value={{
      intakeCalories,
      setIntakeCalories,
      expenditureCalories,
      setExpenditureCalories,
      biometrics,
      setBiometrics,
      goal,
      setGoal,
      dailyTargets,
      setDailyTargets
    }}>
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
