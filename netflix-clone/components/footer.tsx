'use client';

import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='fixed text-center text-white bottom-0 left-0 right-0 p-4 bg-gray-800 z-10'>
			<p>
				Movies Scraped from{' '}
				<Link className='text-blue-500' href='https://www.themoviedb.org/'>
					TMDB
				</Link>
			</p>
		</footer>
	);
}
