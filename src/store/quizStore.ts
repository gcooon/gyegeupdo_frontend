import { create } from 'zustand';

interface QuizState {
  currentStep: number;
  totalSteps: number;
  category: string | null;
  answers: Record<string, string>;
  budgetMax: number | null;
  sessionId: string | null;
  isCompleted: boolean;

  // Actions
  setCategory: (category: string) => void;
  setAnswer: (key: string, value: string) => void;
  setQuizData: (data: Record<string, string>) => void;
  setBudgetMax: (budget: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
  setSessionId: (id: string) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

const initialState = {
  currentStep: 0,
  totalSteps: 5,
  category: null,
  answers: {},
  budgetMax: null,
  sessionId: null,
  isCompleted: false,
};

export const useQuizStore = create<QuizState>((set) => ({
  ...initialState,

  setCategory: (category) => set({ category }),

  setAnswer: (key, value) =>
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    })),

  setQuizData: (data) =>
    set((state) => ({
      answers: { ...state.answers, ...data },
      isCompleted: true,
    })),

  setBudgetMax: (budget) => set({ budgetMax: budget }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  goToStep: (step) =>
    set((state) => ({
      currentStep: Math.max(0, Math.min(step, state.totalSteps - 1)),
    })),

  setTotalSteps: (total) => set({ totalSteps: total }),

  setSessionId: (id) => set({ sessionId: id }),

  completeQuiz: () => set({ isCompleted: true }),

  resetQuiz: () => set(initialState),
}));
