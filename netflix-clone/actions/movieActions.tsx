'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';

const handleError = (error) => {
	console.error(error);
	throw error;
};

export async function getAllMovies() {
	const supabase = await createServerSupabaseClient();

	const { data, error } = await supabase.from('movies').select('*');

	if (error) handleError(error);

	return data;
}

export async function searchMovies({ searchText, page, pageSize }) {
	const supabase = await createServerSupabaseClient();

	const { data, count, error } = await supabase
		.from('movies')
		.select('*')
		.like('title', `%${searchText}%`)
		.range((page - 1) * pageSize, page * pageSize - 1);

	if (error) {
		console.error(error);
		return {
			data: [],
			count: 0,
			page: null,
			pageSize: null,
			error,
		};
	}

	return {
		data,
		page,
		pageSize,
		hasNextPage: count > page * pageSize,
	};
}

export async function getMovie(id: number) {
	const supabase = await createServerSupabaseClient();

	const { data, error } = await supabase.from('movies').select('*').eq('id', id);

	if (error) handleError(error);

	return data[0];
}
