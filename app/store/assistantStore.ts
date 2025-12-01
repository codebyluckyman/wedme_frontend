import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AssistantStore = {
  initialMessage: string | null;
  setInitialMessage: (msg: string) => void;
  clearInitialData: () => void;
};

export const useAssistantStore = create<AssistantStore>()(
  persist(
    set => ({
      initialMessage: null,
      setInitialMessage: msg => set({ initialMessage: msg }),
      clearInitialData: () => set({ initialMessage: null }),
    }),
    {
      name: 'wedding-assistant-data',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
