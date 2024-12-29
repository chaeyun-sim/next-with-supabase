'use client'

import { uploadFile } from '@/actions/storageActions';
import { queryClient } from '@/config/ReactQueryClientProvider';
import { Spinner } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileDragDropZone() {
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate: upload, isPending } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['images']
      });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  })

  const onDrop = useCallback(async (acceptedFiles) => {
    acceptedFiles.forEach(async file => {
      if (file.size > 1024 * 1024) {
        alert('파일 크기는 1MB를 초과할 수 없습니다.');
        return;
      }
        
      const formData = new FormData();
      formData.append(file.name, file);
      const result = await upload(formData);
      console.log(result);
    })
  }, [])

  const { getInputProps, getRootProps, isDragActive } = useDropzone({ onDrop, multiple: true });

	return (
    <div
      {...getRootProps()}
      className='w-full py-20 border-2 border-dotted border-indigo-700 flex flex-col items-center justify-center cursor-pointer'
    >
      <input {...getInputProps()} />
      {isPending ? (
        <Spinner {...({} as any)} />
      ) : isDragActive ? (
        <p>파일을 놓아주세요</p>
      ) : (
        <p>파일을 여기다 끌어다 놓거나 클릭하여 업로드하세요.</p>
      )}
    </div>
  );
}