import { MyDropzone } from "./MyDropzone/MyDropzone";

export function IdleComponent () {
    return (
        <>
        <main className='grid grid-cols-1 md:grid-cols-2 items-center justify-center h-full'>
            <section className='col-span-1 mx-auto px-4 max-w-[30rem]'>
            <h1 className='font-amulya text-5xl font-semibold text-balance'>Convierte tu Excel a etiquetas para imprimir</h1>
            <p className='mt-4 md:mt-6 font-Synonym text-lg font-medium  '><span className='text-[#c561ff]'>Importa</span> tu Excel, selecciona las hojas y filas, <span className='text-[#c561ff]'>visualiza</span> y ajusta la vista previa e <span className='text-[#c561ff]'>imprime</span>  tus etiquetas personalizadas.</p>
            </section>
            
            <MyDropzone/>
        </main>
        </>
    )
}