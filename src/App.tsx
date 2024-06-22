import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import { IdleComponent } from './components/IdleComponent'
import { useFileStore } from './stores/file-store'
import { TableSelectionComponent } from './components/TableSelectionComponent'


enum APP_STATES  {
  IDLE = "IDLE",
  FILE_CHARGING = "FILECHARG",
  TABLE_SELECTION = "TABLESELECTION"
}
// Manejo de la subida:
// Cargar en el componente el array buffer // cambiar el callback o usar then
// Crear la clase del ExcelRepository con el array buffer o el XLSX workbook
// Guardar la instancia en el contexto: El contexto pasaría de Null -> ExcelRep
export function App() {
  const [appState, setAppState] = useState<APP_STATES>(APP_STATES.IDLE)
  const workbook = useFileStore(state => state.workbook)

  useEffect(()=>{
    if(workbook){
      setAppState(APP_STATES.TABLE_SELECTION)
      console.log(workbook)
    }
  },[workbook])


  return (
    <section className='w-screen h-screen flex flex-col bg-white dark:bg-[#333] text-[#333] dark:text-white'>
      <Header />
      {
        appState === APP_STATES.IDLE && (
          <IdleComponent/>
        )
      }
      {
        appState === APP_STATES.TABLE_SELECTION && workbook && (
          <TableSelectionComponent workbook={workbook} />
        )
      }
    </section>
  )
}

