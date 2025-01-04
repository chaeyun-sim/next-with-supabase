'use client';

import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { Button, Input } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export default function Signup({ setView }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [otp, setOtp] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { mutate: signup, isPending: isSignupPending } = useMutation({
		mutationFn: async () => {
			const supabase = createBrowserSupabaseClient();

			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: 'http://localhost:3000/signup/confirm',
				},
			});

			if (data) {
				setIsSubmitted(true);
				setOtp('');
				return;
			}

			if (error) {
				alert(error.message);
				return;
			}
		},
	});

	const { mutate: verify, isPending: isVerifyPending } = useMutation({
		mutationFn: async () => {
			const supabase = createBrowserSupabaseClient();

			const { data, error } = await supabase.auth.verifyOtp({
				type: 'signup',
				email,
				token: otp,
			});

			if (data) {
				setIsSubmitted(true);
				return;
			}

			if (error) {
				alert(error.message);
				return;
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
			<div className='py-6 px-10 w-full flex flex-col items-center justify-center max-w-lg border border-gray-400 bg-white'>
				<img src='/images/instagram.png' alt='logo' className='w-60 mb-6' />
				<div className='flex flex-col gap-2 w-full'>
					{isSubmitted ? (
						<Input
							{...({
								value: otp,
								onChange: (e) => setOtp(e.target.value),
								label: 'otp',
								type: 'text',
								className: 'w-full rounded-sm',
								placeholder: '6자리 OTP를 입력해주세요.',
							} as any)}
						/>
					) : (
						<>
							<Input
								{...({
									value: email,
									onChange: (e) => setEmail(e.target.value),
									label: 'email',
									type: 'string',
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
						</>
					)}

					<Button
						{...({
							onClick: () => {
								if (isSubmitted) {
									verify();
								} else {
									signup();
								}
							},
							color: 'light-blue',
							className: 'w-full text-md py-2',
							loading: isSubmitted ? isVerifyPending : isSignupPending,
							disabled: isSubmitted ? isVerifyPending : isSignupPending,
						} as any)}
					>
						{isSubmitted ? '인증하기' : '가입하기'}
					</Button>
					{!isSubmitted && (
						<>
							<div className='flex flex items-center justify-center py-3 text-gray-600 text-sm'>
								<div className='w-full h-[1px] bg-gray-300' />
								<p className='w-full text-center'>또는</p>
								<div className='w-full h-[1px] bg-gray-300' />
							</div>
							<button onClick={signInWithKakao}>
								<img src='/images/kakao.png' />
							</button>
						</>
					)}
				</div>
			</div>
			{!isSubmitted && (
				<div className='py-4 w-full text-center max-w-lg border border-gray-400 bg-white'>
					이미 계정이 있으신가요?{' '}
					<button
						className='text-light-blue-600 font-bold'
						onClick={() => setView('LOGIN')}
					>
						로그인하기
					</button>
				</div>
			)}
		</div>
	);
}
