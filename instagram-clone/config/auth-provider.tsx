'use client';

import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthProvider({ accessToken, children }) {
	const supabase = createBrowserSupabaseClient();
	const router = useRouter();

	useEffect(() => {
		const {
			data: { subscription: authListener },
		} = supabase.auth.onAuthStateChange((_, session) => {
			if (session?.access_token !== accessToken) {
				router.refresh();
			}
		});

		return () => authListener.unsubscribe();
	}, [accessToken, supabase, router]);

	return children;
}
