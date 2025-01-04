'use client';

import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { Button, Input } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export default function Login({ setView }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { mutate: login, isPending } = useMutation({
		mutationFn: async () => {
			const supabase = await createBrowserSupabaseClient();
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (data) return data;

			if (error) {
				alert(error.message);
			}
		},
	});

	const signInWithKakao = async () => {
		const supabase = await createBrowserSupabaseClient();
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'kakao',
			options: {
				redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
					? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
					: 'http://localhost:3000/auth/callback',
			},
		});

		if (data) {
			return data;
		}

		if (error) {
			console.error('Kakao login error:', error);
			alert(`Error: ${error.message}`);
		}
	};

	return (
		<div className='flex flex-col gap-4'>
			<div className='pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-lg border border-gray-400 bg-white'>
				<div className='flex flex-col gap-2 w-full'>
					<img src='/images/instagram.png' alt='logo' className='w-60 mb-6' />
					<Input
						{...({
							value: email,
							onChange: (e) => setEmail(e.target.value),
							label: 'email',
							type: 'email',
							className: 'w-full rounded-sm',
						} as any)}
					/>
					<Input
						{...({
							value: password,
							onChange: (e) => setPassword(e.target.value),
							label: 'password',
							type: 'password',
							className: 'w-full rounded-sm',
						} as any)}
					/>
					<Button
						{...({
							onClick: () => login(),
							color: 'light-blue',
							className: 'w-full text-md py-2',
							disabled: isPending,
							loading: isPending,
						} as any)}
					>
						로그인하기
					</Button>
					<div className='flex flex items-center justify-center py-3 text-gray-600 text-sm'>
						<div className='w-full h-[1px] bg-gray-300' />
						<p className='w-full text-center'>또는</p>
						<div className='w-full h-[1px] bg-gray-300' />
					</div>
					<button onClick={signInWithKakao}>
						<img src='/images/kakao.png' />
					</button>
				</div>
			</div>
			<div className='py-4 w-full text-center max-w-lg border border-gray-400 bg-white'>
				아직 계정이 없으신가요?{' '}
				<button
					className='text-light-blue-600 font-bold'
					onClick={() => setView('SIGNUP')}
				>
					가입하기
				</button>
			</div>
		</div>
	);
}
