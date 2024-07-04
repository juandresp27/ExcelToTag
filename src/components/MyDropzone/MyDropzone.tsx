import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { useFileStore } from '../../stores/file-store'
import { ExcelRepository } from '../../utils/ExcelRepository';
import { Button } from '@nextui-org/react';

export function MyDropzone() {
  const workbookSetter = useFileStore(state => state.setWorkbook)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    // Validar tipo de file, lanzar errores
    ExcelRepository.fileToWorkBook(file).then(workbook => {
      workbookSetter(workbook);
    })
  }, [workbookSetter])

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
                <p className='font-semibold'>Drop the file here ...</p> :
                <div className='flex flex-col justify-center items-center gap-2'>
                  <span className='font-semibold'>Drag an item to the container or</span>
                  <Button type="button" onClick={open} color='secondary'>
                    Open it from here
                  </Button>
                </div>
            }
        </div>
    </section>
  )
}