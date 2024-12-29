'use client'

import { useQuery } from '@tanstack/react-query';
import DropboxImage from './dropbox-image'
import { searchFiles } from '@/actions/storageActions';
import { Spinner } from '@material-tailwind/react';

export default function DropboxImageList({ searchInput }) {
  const { data: images, isLoading } = useQuery({
    queryKey: ['images', searchInput],
    queryFn: async () => searchFiles(searchInput),
  })

  return (
    <section className='grid grid-cols-3 lg:grid-cols-4'>
      {isLoading && <Spinner {...({}) as any} />}
      {images?.map(image => (
        <DropboxImage key={image.id} image={image} />
      ))}
    </section>
  );
}