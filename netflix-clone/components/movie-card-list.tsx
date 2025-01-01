'use client';

import MovieCard from './movie-card';
import { searchMovies } from '@/actions/movieActions';
import { Spinner } from '@material-tailwind/react';
import { useSearch } from '@/stores/useSearch';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function MovieCardList() {
	const { searchText } = useSearch();

	const { data, isFetchingNextPage, isFetching, hasNextPage, fetchNextPage } =
		useInfiniteQuery({
			initialPageParam: 1,
			queryKey: ['movies', searchText],
			queryFn: ({ pageParam }) =>
				searchMovies({ searchText, page: pageParam, pageSize: 12 }),
			getNextPageParam: (lastPage) => (lastPage.page ? lastPage.page + 1 : null),
		});

	const { ref, inView } = useInView({
		threshold: 0,
	});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage && !isFetching) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	return (
		<div className='grid gap-1 md:grid-cols-4 grid-cols-3 w-full h-full'>
			{(isFetching || isFetchingNextPage) && <Spinner {...({} as any)} />}
			{
				<>
					{data?.pages
						?.map((page) => page.data)
						?.flat()
						?.map((movie) => (
							<MovieCard key={movie.id} movie={movie} />
						))}
					<div ref={ref} />
				</>
			}
		</div>
	);
}
