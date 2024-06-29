import { create } from 'zustand'
import { WorkBook } from "xlsx"
export interface WorkbookStore {
    workbook: WorkBook | null;
    jsonSelected: any[] | null;
    setWorkbook: (workbook: WorkBook) => void;
    setJsonSelected: (jsonSelected: any[]) => void;
  }

export const useFileStore = create<WorkbookStore>((set) => ({
  workbook: null,
  jsonSelected: null,
  setWorkbook: (workbook) => set({ workbook }),
  setJsonSelected: (jsonSelected) => set({ jsonSelected }),
}))