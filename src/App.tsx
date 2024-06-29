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

  useEffect(()=>{
    if(workbook){
      setAppState(APP_STATES.TABLE_SELECTION)
      console.log(workbook)
    }
    if(jsonSelected){
      setAppState(APP_STATES.READY)
      console.log(jsonSelected)
      
    }
  },[workbook, jsonSelected])


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
      {
        appState === APP_STATES.READY && jsonSelected && (
          <PrincipalApp json={jsonSelected}/>
        )
      }
    </section>
  )
}

