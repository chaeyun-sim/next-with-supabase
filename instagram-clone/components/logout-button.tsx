'use client';

import React from 'react';
import { Button } from '@material-tailwind/react';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';

export default function LogoutButton() {
	const handleLogout = async () => {
		const supabase = await createBrowserSupabaseClient();
		const { error } = await supabase.auth.signOut();

		if (error) {
			alert(error.message);
			return;
		}
	};

	return (
		<Button {...({ onClick: handleLogout, color: 'red' } as any)}>Logout</Button>
	);
}
