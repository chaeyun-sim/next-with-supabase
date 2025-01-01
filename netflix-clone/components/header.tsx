'use client';

import { useSearch } from '@/stores/useSearch';
import Logo from './logo';

export default function Header() {
	const { searchText, setSearchText } = useSearch();

	return (
		<header className='fixed top-0 left-0 right-0 p-4 bg-gray-800 flex items-center justify-between z-10'>
			<nav className='flex gap-4 items-center'>
				<Logo />
				<ul className='flex gap-2 text-white'>
					<li>Movies</li>
					<li>Drama</li>
				</ul>
			</nav>
			<div className='flex w-full max-w-72 gap-2 items-center border border-white rounded-md p-2 text-white'>
				<i className='fas fa-search' />
				<input
					className='bg-transparent outline-none'
					placeholder='Search Movies'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</div>
		</header>
	);
}
