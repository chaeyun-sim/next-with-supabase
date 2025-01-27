import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../config/material-tailwind-theme-provider';
import ReactQueryClientProvider from '@/config/ReactQueryClientProvider';
import { ReactNode } from 'react';
import MainLayout from '@/components/layouts/main-layout';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import AuthProvider from '@/config/auth-provider';
import AuthLayout from '@/components/layouts/auth-layout';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const supabase = await createServerSupabaseClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const sessionData = session ? JSON.parse(JSON.stringify(session)) : null;

	return (
		<ReactQueryClientProvider>
			<ThemeProvider>
				<html lang='en'>
					<head>
						<link
							rel='stylesheet'
							href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
							integrity='sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=='
							crossOrigin='anonymous'
							referrerPolicy='no-referrer'
						/>
					</head>
					<AuthProvider accessToken={sessionData?.access_token}>
						<body className={inter.className}>
							{sessionData ? <MainLayout>{children}</MainLayout> : <AuthLayout />}
						</body>
					</AuthProvider>
				</html>
			</ThemeProvider>
		</ReactQueryClientProvider>
	);
}
