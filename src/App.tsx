import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import { IdleComponent } from './components/IdleComponent'
import { useFileStore } from './stores/file-store'
import { TableSelectionComponent } from './components/TableSelectionComponent'
import { PrincipalApp } from './components/PrincipalApp'


enum APP_STATES  {
  IDLE = "IDLE",
  TABLE_SELECTION = "TABLESELECTION",
  READY = "READY",
}

export function App() {
  const [appState, setAppState] = useState<APP_STATES>(APP_STATES.IDLE)
  const workbook = useFileStore(state => state.workbook)
  const jsonSelected = useFileStore(state => state.jsonSelected)

  const setWorkbook = useFileStore(state => state.setWorkbook)
  const setJson = useFileStore(state => state.setJsonSelected)

  useEffect(()=>{
    if(workbook){
      setAppState(APP_STATES.TABLE_SELECTION)
    }
    if(jsonSelected){
      setAppState(APP_STATES.READY)
    }
  },[workbook, jsonSelected])

  const handleBack = () => {
    if(appState === APP_STATES.IDLE) return

    if(appState === APP_STATES.TABLE_SELECTION){
      setAppState(APP_STATES.IDLE)
      setWorkbook(null)
    }

    if(appState === APP_STATES.READY){
      setAppState(APP_STATES.TABLE_SELECTION)
      setJson(null)
    }
  }


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
          <TableSelectionComponent workbook={workbook} goBack={handleBack}/>
        )
      }
      {
        appState === APP_STATES.READY && jsonSelected && (
          <PrincipalApp json={jsonSelected} goBack={handleBack}/>
        )
      }
      <footer className="justify-end flex w-full bg-zinc-800 text-white py-2 px-4 font-semibold text-sm">
        By @juandresp27
      </footer>
    </section>
  )
}

