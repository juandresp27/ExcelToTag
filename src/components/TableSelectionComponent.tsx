import { Button, Tab, Tabs } from "@nextui-org/react";
import { ReactGrid, Range } from "@silevis/reactgrid";
import { Key, useEffect, useState } from "react";
import { type WorkBook } from "xlsx";
import { DataParsed, ExcelRepository } from "../utils/ExcelRepository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faToolbox } from "@fortawesome/free-solid-svg-icons";
import "./table-selection.scss"
import { useFileStore } from "../stores/file-store";


export function TableSelectionComponent({ workbook }: { workbook: WorkBook }) {
  const [sheetSelected, setSheetSelected] = useState(workbook.SheetNames[0]) 
  const [data, setData] = useState<DataParsed | null>(null)
  const [json, setJson] = useState<any[]>([])
  const setJsonSelected = useFileStore(state => state.setJsonSelected)

  const handleChange = (selectedRange: Range[]) => {
    const [range] = selectedRange
    if(data){
      const json = ExcelRepository.dataToJson(range, data)
      setJson(json)
      console.log("Json", json)
    }
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
    <section className='max-w-2xl  m-auto flex flex-col p-4 justify-between h-full font-Synonym items-center '>
      <Tabs 
        aria-label="SheetNames"
        selectedKey={sheetSelected}
        onSelectionChange={handleTabChange}
      >
        {
          sheetNamesList.map(name =>
            <Tab key={name} title={name}>
              {
                data && (
                  <div className="max-w-2xl max-h-96 p-2 dark: text-white overflow-auto scrollbar-thin scrollbar-corner-[#773a9b] scrollbar-thumb-[#c561ff] scrollbar-track-white dark:scrollbar-track-[#4d4c4c]  scrollbar-thumb-rounded-full">
                    <ReactGrid 
                      rows={data.rows}
                      columns={data.columns}
                      enableRangeSelection 
                      onSelectionChanged={handleChange}
                      
                    />
                  </div>
                  
                )
              }
            </Tab>
          )
        }
      </Tabs>
      <div className="w-full flex justify-between">
        <Button startContent={<FontAwesomeIcon icon={faArrowLeft} />}>Volver</Button>
        <Button 
          startContent={<FontAwesomeIcon icon={faToolbox}/>} 
          isDisabled={json.length === 0} 
          color="secondary"
          onClick={()=>{setJsonSelected(json)}}
        >
          Elegir
        </Button>
      </div>
    </section>
  )
}