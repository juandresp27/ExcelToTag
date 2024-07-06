import { create } from 'zustand'
import { WorkBook } from "xlsx"
export interface WorkbookStore {
    workbook: WorkBook | null;
    jsonSelected: Record<string,string>[] | null;
    setWorkbook: (workbook: WorkBook | null) => void;
    setJsonSelected: (jsonSelected: Record<string,string>[] | null) => void;
  }

export const useFileStore = create<WorkbookStore>((set) => ({
  workbook: null,
  jsonSelected: null,
  setWorkbook: (workbook) => set({ workbook }),
  setJsonSelected: (jsonSelected) => set({ jsonSelected }),
}))