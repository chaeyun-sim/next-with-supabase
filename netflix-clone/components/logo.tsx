'use client';

import Image from 'next/image';

export default function Logo() {
	return (
		<div className='flex items-center gap-1'>
			<Image
				src='/images/tmdbflix_logo.png'
				alt='logo'
				width={50}
				height={30}
				className='!w-24 !h-auto'
			/>
		</div>
	);
}
