import { Tab, Tabs } from "@nextui-org/react";
import { ReactGrid, Column, Row, Range } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { Key, useEffect, useState } from "react";
import { type WorkBook } from "xlsx";
import { ExcelRepository } from "../utils/ExcelRepository";

interface Person {
  name: string;
  surname: string;
}

const getPeople = (): Person[] => [
  { name: "Thomas", surname: "Goldman" },
  { name: "Susie", surname: "Quattro" },
  { name: "", surname: "" }
];

const getColumns = (): Column[] => [
  { columnId: "name", width: 150 },
  { columnId: "surname", width: 150 }
];

const headerRow: Row = {
  rowId: "header",
  cells: [
    { type: "header", text: "Name" },
    { type: "header", text: "Surname" }
  ]
};

const getRows = (people: Person[]): Row[] => [
  headerRow,
  ...people.map<Row>((person, idx) => ({
    rowId: idx,
    cells: [
      { type: "text", text: person.name },
      { type: "text", text: person.surname }
    ]
  }))
];

const sheet = (workbook: WorkBook, name: string) => {
  return workbook.Sheets[name]
}

export function TableSelectionComponent({ workbook }: { workbook: WorkBook }) {
  const [sheetSelected, setSheetSelected] = useState(workbook.SheetNames[0]) 
  const [people] = useState<Person[]>(getPeople());
  const rows = getRows(people);
  const columns = getColumns();
  const handleChange = (selectedRange: Range[]) => {
    console.log("rango:",selectedRange)
  }
  const sheetNamesList = workbook?.SheetNames ?? []

  const handleTabChange = (key: Key) => {
    setSheetSelected(key.toString())
  }

  useEffect(()=>{
    ExcelRepository.getDataFromSheet(workbook.Sheets[sheetSelected])
  },[sheetSelected, workbook])
  return (
    <section className='flex-1 rounded-md flex flex-col h-full font-Synonym items-center justify-center'>
      <Tabs 
        aria-label="SheetNames"
        selectedKey={sheetSelected}
        onSelectionChange={handleTabChange}
      >
        {
          sheetNamesList.map(name =>
            <Tab key={name} title={name} className="h-full rounded-lg">
              <ReactGrid 
                rows={rows}
                columns={columns}
                enableRangeSelection 
                onSelectionChanged={handleChange}
                
              />
            </Tab>
          )
        }
      </Tabs>
    </section>
  )
}