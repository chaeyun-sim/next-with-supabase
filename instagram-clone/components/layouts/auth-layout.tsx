'use client';

import { useState } from 'react';
import Signup from '../auth/signup';
import Login from '../auth/login';

export default function AuthLayout() {
	const [view, setView] = useState<'SIGNUP' | 'LOGIN'>('LOGIN');

	return (
		<main className='h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-light-blue-50'>
			{view === 'SIGNUP' ? (
				<Signup setView={setView} />
			) : (
				<Login setView={setView} />
			)}
		</main>
	);
}
