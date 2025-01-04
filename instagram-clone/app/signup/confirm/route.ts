import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const requestURL = new URL(request.url);
	const code = requestURL.searchParams.get('code');

	if (code) {
		const supabase = await createServerSupabaseClient();
		await supabase.auth.exchangeCodeForSession(code);
	}

	return NextResponse.redirect(requestURL.origin);
}
