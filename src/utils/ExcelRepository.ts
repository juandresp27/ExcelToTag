
import * as XLSX from "xlsx"
export class ExcelRepository {
  workbook: XLSX.WorkBook | null = null;
  constructor(){
  }
  
  async fileToWorkbook(file: File){
    const data = await file.arrayBuffer();
    this.workbook =  XLSX.read(data)
  } 
}