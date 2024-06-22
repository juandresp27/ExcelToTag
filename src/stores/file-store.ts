import { create } from 'zustand'
import { WorkBook } from "xlsx"
export interface WorkbookStore {
    workbook: WorkBook | null;
    setWorkbook: (workbook: WorkBook) => void;
  }

export const useFileStore = create<WorkbookStore>((set) => ({
  workbook: null,
  setWorkbook: (workbook) => set({ workbook }),
}))