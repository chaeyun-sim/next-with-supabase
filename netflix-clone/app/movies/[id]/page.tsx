'use client';

import { getMovie } from '@/actions/movieActions';
import UI from './ui';

export async function generateMetadata({ params, searchParams }) {
	const movie = await getMovie(params.id);

	return {
		title: movie.title,
		description: movie.overview,
		openGraph: {
			images: [movie.image_url],
			title: movie.title,
			description: movie.overview,
		},
	};
}

export default function MoviePage({ params }) {
	return (
		<main className='bg-blue-50 absolute z-1 top-0 left-0 right-0 bottom-0 py-20 flex items-center'>
			<UI id={params.id} />;
		</main>
	);
}
