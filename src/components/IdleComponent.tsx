import { MyDropzone } from "./MyDropzone/MyDropzone";

export function IdleComponent () {
    return (
        <>
        <main className='grid grid-cols-1 md:grid-cols-2 items-center justify-center h-full'>
            <section className='col-span-1 mx-auto px-4 max-w-[30rem]'>
            <h1 className='font-amulya text-5xl font-semibold text-balance'>Convert your Excel to printable labels</h1>
            <p className='mt-4 md:mt-6 font-Synonym text-lg font-medium  '><span className='text-[#c561ff]'>Import</span> your Excel, select sheets and rows, <span className='text-[#c561ff]'>view</span> and adjust the preview, and <span className='text-[#c561ff]'>print</span> your custom labels.</p>
            </section>
            
            <MyDropzone/>
        </main>
        </>
    )
}