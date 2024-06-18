import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { useFileStore } from '../../stores/file-store'

export function MyDropzone() {
  const setterFile = useFileStore(state => state.setExcelFile)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    // Validar tipo de file, lanzar errores
    setterFile(file)
  }, [setterFile])
  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    onDrop,
    maxFiles: 1, 
    noClick: true,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  })

  return (
    <section className='flex w-full h-full p-6'>
        <div {...getRootProps()} className='flex items-center justify-center w-full px-4  rounded-lg bg-[#c561ff11] border-dashed border-2 border-[#c561ff]'>
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p className='font-semibold'>Suelta el archivo aquí ...</p> :
                <div className='flex flex-col justify-center items-center gap-2'>
                  <span className='font-semibold'>Arrastra un elemento al contenedor o</span>
                  <button type="button" onClick={open} >
                    Ábrelo desde aquí
                  </button>
                </div>
            }
        </div>
    </section>
  )
}