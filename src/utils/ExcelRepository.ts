
import * as XLSX from "xlsx"

export class ExcelRepository {
  
  constructor() {}

  static async fileToWorkBook(file: File): Promise<XLSX.WorkBook> {
    const arrayBuffer = await file.arrayBuffer();
    return XLSX.read(arrayBuffer)
  }

  static getDataFromSheet(sheet: XLSX.WorkSheet){
    for(const [refKey, cellValue] of Object.entries(sheet)){
      console.log(refKey)
    }
    
  }

}


