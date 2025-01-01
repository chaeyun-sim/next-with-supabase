'use server';

import { CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types_db';

export const createServerSupabaseClient = async (admin: boolean = false) => {
	const cookieStore = await cookies();

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		admin
			? process.env.NEXT_SUPABASE_SERVICE_ROLE
			: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					try {
						cookieSwre.set({ name, value, ...options });
					} catch (error) {
						// ...
					}
				},
				remove(name: string, options: CookieOptions) {
					try {
						cookieStore.set({ name, value: '', ...options });
					} catch (error) {
						// ...
					}
				},
			},
		}
	);
};

export const createServerSupabaseAdminClient = async () =>
	createServerSupabaseClient(true);
