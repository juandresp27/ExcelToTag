import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface FlowDataStore {
    excelFile: File | null;
    setExcelFile: (excelFile: File) => void;
  }

export const useFileStore = create<FlowDataStore>()(
  persist(
    (set) => ({
      excelFile: null,
      setExcelFile: (excelFile) => set({ excelFile }),
    }),
    {
      name: 'excel-file', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)