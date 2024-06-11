import './App.css'
import Header from './components/Header/Header'

export function App() {

  return (
    <section className='w-screen h-screen flex flex-col bg-white dark:bg-zinc-800 text-[#333] dark:text-white'>
      <Header />
      <main>
        <h1>Hola mundo</h1>
      </main>
    </section>
  )
}

