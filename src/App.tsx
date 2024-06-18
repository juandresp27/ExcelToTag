import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import { MyDropzone } from './components/MyDropzone/MyDropzone'
import { IdleComponent } from './components/IdleComponent'
import { useFileStore } from './stores/file-store'
import { ExcelRepository } from './utils/ExcelRepository'

enum APP_STATES  {
  IDLE = "IDLE",
  FILE_CHARGING = "FILECHARG",
  APP_READY = "APPREADY"
}
export function App() {
  const excelFile = useFileStore(state => state.excelFile);
  const [appState, setAppState] = useState<APP_STATES>(APP_STATES.IDLE)

  useEffect(() => {
    if(excelFile !== null) {
      const excel = new ExcelRepository(excelFile) // Lectura asincrona no hay respuesta...
      console.log(excel.workbook)
    }
  },[excelFile])


  return (
    <section className='w-screen h-screen flex flex-col bg-white dark:bg-zinc-800 text-[#333] dark:text-white'>
      <Header />
      {
        appState === "IDLE" && (
          <IdleComponent/>
        )
      }
    </section>
  )
}

