'use client';

import { getMovie } from '@/actions/movieActions';
import { useQuery } from '@tanstack/react-query';

export default function UI({ id }) {
	const { data: movie } = useQuery({
		queryKey: ['single-movie', id],
		queryFn: () => getMovie(id),
	});

	if (!movie) return <div>Movie does not exist.</div>;

	return (
		<div className='flex flex-col md:flex-row items-center'>
			<img src={movie.image_url} alt={movie.title} className='w-1/2' />
			<div className='md:w-2/3 w-full items-center md:items-start flex flex-col p-4 gap-4'>
				<h1 className='text-3xl font-bold'>{movie.title}</h1>
				<p className='text-lg font-medium'>{movie.overview}</p>
				<div className='font-bold text-lg'>
					<i className='fas fa-star mr-1' />
					Vote Average : {movie.vote_average}
				</div>
				<div className='font-bold text-lg'>Popularity: {movie.popularity}</div>
				<div className='font-bold text-lg'>Release date: {movie.release_date}</div>
			</div>
		</div>
	);
}
