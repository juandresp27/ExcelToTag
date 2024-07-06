
import { Column, HeaderCell, Range, Row, TextCell } from "@silevis/reactgrid";
import * as XLSX from "xlsx"

export interface DataParsed {
  columns: Column[];
  rows: Row<TextCell | HeaderCell>[];
}

function* letterGenerator(end: string) {
  const start = "A".charCodeAt(0);
  const toLetters = (num: number) => {
    let letters = "";
    while (num >= 0) {
      letters = String.fromCharCode(num % 26 + start) + letters;
      num = Math.floor(num / 26) - 1;
    }
    return letters;
  };

  const endIndex = (() => {
    let result = 0;
    for (let i = 0; i < end.length; i++) {
      result *= 26;
      result += end.charCodeAt(i) - start + 1;
    }
    return result - 1;
  })();

  for (let i = 0; i <= endIndex; i++) {
    yield toLetters(i);
  }
}
function* numberGenerator(end: number) {
  for (let i = 1; i <= end; i++) {
    yield i;
  }
}

export class ExcelRepository {

  constructor() { }

  static async fileToWorkBook(file: File): Promise<XLSX.WorkBook> {
    const arrayBuffer = await file.arrayBuffer();
    return XLSX.read(arrayBuffer)
  }

  static getDataFromSheet(sheet: XLSX.WorkSheet): DataParsed {

    const { maximumLetter, maximumNumber } = this.getMaxRefFromSheet(sheet)

    const letterArray = this.generateLettersArray(maximumLetter)
    const numberArray = this.generateNumbersArray(maximumNumber)

    const headerRow: Row<HeaderCell> = {
      rowId: "header",
      cells: [
        { type: "header", text: " " },
        ...letterArray.map<HeaderCell>(column => ({ type: "header", text: column }))
      ]
    }

    const columns: Column[] = [
      { columnId: " ", width: 50 },
      ...letterArray.map(letter => ({ columnId: letter, width: 150 }))
    ]

    const data = new Map();
    for (let i = 0; i < numberArray.length; i++) {
      const row = numberArray[i];
      for (let j = 0; j < letterArray.length; j++) {
        const column = letterArray[j];
        const key = column + row
        if (data.has(row)) {
          const previusRow = data.get(row);
          data.set(row, { ...previusRow, [column]: sheet[key]?.v ?? "" })
        } else {
          data.set(row, { row, [column]: sheet[key]?.v ?? "" })
        }
      }
    }

    const dataArray = Array.from(data, ([, value]) => (value))
    const rows: Array<Row<HeaderCell | TextCell>> = [
      headerRow,
      ...dataArray.map<Row<TextCell>>(rowData => ({
        rowId: rowData.row,
        cells: [
          { type: "text", text: String(rowData.row) },
          ...letterArray.map<TextCell>(column => ({ type: "text", text: String(rowData[column]) }))
        ]
      }))
    ]

    return ({
      columns,
      rows
    })

  }

  private static getMaxRefFromSheet(sheet: XLSX.WorkSheet) {
    let maximumLetter = "A";
    let maximumNumber = 1;
    if (sheet["!ref"] !== undefined) {
      const [, finalCell] = sheet["!ref"].split(":")
      const [column, row] = this.getLetterAndNumber(finalCell)
      if (column && row) {
        maximumLetter = column
        maximumNumber = Number(row)
        return { maximumLetter, maximumNumber }
      }
    }

    for (const [key] of Object.entries(sheet)) {
      const [letter, number] = this.getLetterAndNumber(key)
      if (number && Number(number) > maximumNumber) {
        maximumNumber = Number(number)
      }
      if (letter) {
        const actualLetter = this.letterToNumber(maximumLetter);
        const compareLetter = this.letterToNumber(letter)
        if (compareLetter > actualLetter) maximumLetter = letter
      }
    }

    return { maximumLetter, maximumNumber }
  }

  private static letterToNumber(letter: string) {
    let number = 0;
    const length = letter.length;
    for (let i = 0; i < length; i++) {
      number = number * 26 + (letter.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    return number;
  }

  private static getLetterAndNumber(value: string) {
    const match = value.match(/^([A-Z]+)(\d+)$/);
    if (!match) return [undefined, undefined]
    return [match[1], match[2]]
  }

  private static generateLettersArray(end: string) {
    const generator = letterGenerator(end);
    const letters = [];
    for (const letter of generator) {
      letters.push(letter);
    }
    return letters;
  }

  private static generateNumbersArray(end: number) {
    const generator = numberGenerator(end);
    const numbers = [];
    for (const number of generator) {
      numbers.push(number);
    }
    return numbers;
  }

  static dataToJson(range: Range, data: DataParsed) {
    const columns = range.columns.map(column => column.idx)
    const rows = range.rows.map(column => column.idx)
    const indexes = {
      initialRow: rows[0],
      finalRow: rows[rows.length - 1] +1,
      initialColumn: columns[0],
      finalColumn: columns[columns.length - 1]
    }
    const dataSelectedIn = data?.rows.slice(indexes.initialRow, indexes.finalRow)
    const jsonData = []
    if(dataSelectedIn){

      const [firstRow] = dataSelectedIn;
      const selectedHeader = firstRow.cells
        .slice(indexes.initialColumn, indexes.finalColumn + 1)
        .map(cell => cell.text)

      for (let i = 1; i < dataSelectedIn.length; i++) {
        const row = dataSelectedIn[i];
        const cells = row.cells.slice(indexes.initialColumn, indexes.finalColumn + 1)
        const obj = new Map()
        selectedHeader?.forEach((head, index) => {
          obj.set(head, cells[index]?.text)
        })
        jsonData.push(Object.fromEntries(obj))
      }
    }
    return jsonData
  }

}




