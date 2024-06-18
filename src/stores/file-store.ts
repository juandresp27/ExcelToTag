import { create } from 'zustand'

export interface FlowDataStore {
    excelFile: File | null;
    setExcelFile: (excelFile: File) => void;
  }

export const useFileStore = create<FlowDataStore>((set) => ({
  excelFile: null,
  setExcelFile: (excelFile) => set({ excelFile }),
}))