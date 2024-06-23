import { Tab, Tabs } from "@nextui-org/react";
import { ReactGrid, Range } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { Key, useEffect, useState } from "react";
import { type WorkBook } from "xlsx";
import { DataParsed, ExcelRepository } from "../utils/ExcelRepository";


export function TableSelectionComponent({ workbook }: { workbook: WorkBook }) {
  const [sheetSelected, setSheetSelected] = useState(workbook.SheetNames[0]) 
  const [data, setData] = useState<DataParsed | null>(null)
  const handleChange = (selectedRange: Range[]) => {
    console.log("rango:",selectedRange)
  }
  const sheetNamesList = workbook?.SheetNames ?? []

  const handleTabChange = (key: Key) => {
    setSheetSelected(key.toString())
  }

  useEffect(()=>{
    const dataParsed = ExcelRepository.getDataFromSheet(workbook.Sheets[sheetSelected])
    console.log(dataParsed)
    setData(dataParsed)
  },[sheetSelected, workbook])

  return (
    <section className='flex-1 rounded-md flex flex-col h-full font-Synonym items-center justify-center'>
      <Tabs 
        aria-label="SheetNames"
        selectedKey={sheetSelected}
        onSelectionChange={handleTabChange}
        style={{color: "red "}}
      >
        {
          sheetNamesList.map(name =>
            <Tab key={name} title={name} className="h-full rounded-lg flex  items-center">
              {
                data && (
                    <ReactGrid 
                      rows={data.rows}
                      columns={data.columns}
                      enableRangeSelection 
                      onSelectionChanged={handleChange}
                      
                    />
                  
                )
              }
            </Tab>
          )
        }
      </Tabs>
    </section>
  )
}