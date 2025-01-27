'use server';

import {
	createServerSupabaseAdminClient,
	createServerSupabaseClient,
} from '@/utils/supabase/server';
import { createServerClient } from '@supabase/ssr';

export async function getAllUsers() {
	const supabase = await createServerSupabaseAdminClient();

	const { data, error } = await supabase.auth.admin.listUsers();

	if (error) {
		console.error('Error fetching users:', error);
		return [];
	}

	if (!data || !data.users) {
		console.error('No users found or data structure is incorrect:', data);
		return [];
	}

	return data.users;
}

export async function getUserById(userId) {
	const supabase = await createServerSupabaseAdminClient();

	const { data, error } = await supabase.auth.admin.getUserById(userId);

	if (error) return null;
	return data.user;
}
