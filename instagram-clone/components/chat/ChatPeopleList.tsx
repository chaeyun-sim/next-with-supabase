'use client';

import { useQuery } from '@tanstack/react-query';
import Person from './Person';
import { useSelectedUserId } from '@/store/selectedIndex';
import { getAllUsers } from '@/actions/chat-actions';
import { useSelectedUserIndex } from '@/store/selectedUserIndex';
import { useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { usePresenceState } from '@/store/presenceState';

export default function ChatPeopleList({ loggedInUser }) {
	const supabase = createBrowserSupabaseClient();

	const { selectedUserId, setSelectedUserId } = useSelectedUserId();
	const { setSelectedUserIndex } = useSelectedUserIndex();
	const { presence, setPresence } = usePresenceState();

	const getAllUsersQuery = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const allUsers = await getAllUsers();
			return allUsers.filter((user) => user.id !== loggedInUser);
		},
	});

	useEffect(() => {
		const channel = supabase.channel('online-users', {
			config: {
				presence: {
					key: loggedInUser,
				},
			},
		});

		channel.on(
			`presence`,
			{
				event: 'sync',
			},
			() => {
				const newState = channel.presenceState();
				const newStateObj = JSON.parse(JSON.stringify(newState));
				setPresence(newStateObj);
			}
		);

		channel.subscribe(async (status) => {
			if (status !== 'SUBSCRIBED') return;
			const newPresenceStatus = await channel.track({
				onlineAt: new Date().toISOString(),
			});
		});

		return () => {
			channel.unsubscribe();
		};
	}, []);

	return (
		<div className='h-screen min-w-60 flex flex-col bg-gray-50'>
			{getAllUsersQuery.data?.map((user, index) => (
				<Person
					key={user.id}
					index={index}
					isActive={selectedUserId === user.id}
					name={user.email.split('@')[0]}
					onChatScreen={false}
					onlineAt={(presence as any)?.[user.id]?.[0]?.onlineAt}
					userId={user.id}
					onClick={() => {
						setSelectedUserId(user.id);
						setSelectedUserIndex(index);
					}}
				/>
			))}
		</div>
	);
}
