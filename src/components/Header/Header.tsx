import './header.css'
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

export default function Header() {
  return (
    <header className='flex px-4 py-4'>
        <section className='px-6 py-4 bg-white dark:bg-zinc-700 rounded-full w-full flex justify-between items-center custom-shadow'>
            
            <span className='px-4 flex flex-col font-DMSans font-semibold'>
              <h3 className='text-[1.6rem] [line-height:1.2rem;]'>EXCEL</h3>
              <h4 className='[line-height:1rem;] text-[0.94rem]'><span className='text-[#c561ff] '>TO</span> LABELS</h4>
            </span>
            
            <ThemeSwitcher/>
        </section>
    </header>
  )
}
