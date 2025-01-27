'use client';

import Person from './Person';
import Message from './Messsage';
import { useSelectedUserId } from '@/store/selectedIndex';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserById } from '@/actions/chat-actions';
import { useSelectedUserIndex } from '@/store/selectedUserIndex';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Spinner } from '@material-tailwind/react';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { usePresenceState } from '@/store/presenceState';

export async function getAllMessage({ chatUserId }) {
	const supabase = await createBrowserSupabaseClient();

	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error || !session.user) {
		throw new Error('User is not authenticated!');
	}

	const { data, error: messageError } = await supabase
		.from('message')
		.select('*')
		.or(`receiver.eq.${chatUserId}, receiver.eq.${session.user.id}`)
		.or(`sender.eq.${chatUserId}, sender.eq.${session.user.id}`)
		.order('created_at', { ascending: true });

	if (messageError) {
		throw new Error(messageError.message);
	}

	return data;
}

export async function sendMessage({ message, chatUserId }) {
	const supabase = await createBrowserSupabaseClient();

	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error || !session.user) {
		throw new Error('User is not authenticated!');
	}

	const { data, error: sendMessageError } = await supabase
		.from('message')
		.insert({
			message,
			receiver: chatUserId,
		});

	if (sendMessageError) {
		throw new Error(sendMessageError.message);
	}

	return data;
}

export default function ChatScreen({}) {
	const supabase = createBrowserSupabaseClient();

	const { selectedUserId } = useSelectedUserId();
	const { selectedUserIndex } = useSelectedUserIndex();
	const { presence } = usePresenceState();

	const [message, setMessage] = useState('');
	const messageRef = useRef<HTMLDivElement>(null);

	const selectedUserQuery = useQuery({
		queryKey: ['user', selectedUserId],
		queryFn: () => getUserById(selectedUserId),
	});

	const sendMessageMutation = useMutation({
		mutationFn: async () => {
			await sendMessage({
				message,
				chatUserId: selectedUserId,
			});
		},
		onSuccess: () => {
			setMessage('');
			getAllMessageQuery.refetch();
			handleScrollToView();
		},
	});

	const getAllMessageQuery = useQuery({
		queryKey: ['messages', selectedUserId],
		queryFn: () => getAllMessage({ chatUserId: selectedUserId }),
	});

	useEffect(() => {
		const channel = supabase
			.channel('message_postgres_changes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'message',
				},
				(payload) => {
					if (payload.eventType === 'INSERT' && !payload.errors) {
						getAllMessageQuery.refetch();
						handleScrollToView();
					}
				}
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, []);

	const handleScrollToView = () => {
		if (messageRef) {
			messageRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			});
		}
	};

	useEffect(() => {
		if (getAllMessageQuery.data) {
			handleScrollToView();
		}
	}, [getAllMessageQuery]);

	return selectedUserQuery.data !== null ? (
		<div className='w-full flex flex-col px-4 gap-3 h-screen'>
			<Person
				index={selectedUserIndex}
				isActive={false}
				name={selectedUserQuery.data?.email?.split('@')[0]}
				onChatScreen={true}
				onlineAt={(presence as any)?.[selectedUserId]?.[0]?.onlineAt ?? null}
				userId={selectedUserQuery.data?.id}
			/>

			<div className='flex-1 w-full flex flex-col px-4 gap-3 overflow-y-scroll'>
				{getAllMessageQuery?.data?.map((message) => (
					<Message
						key={message.id}
						isFromMe={message.receiver === selectedUserId}
						message={message.message}
					/>
				))}
				<div ref={messageRef} />
			</div>

			<div className='flex'>
				<input
					className='p-4 w-full outline-none border border-2 border-light-blue-600'
					placeholder='메세지 입력...'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
						if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
							sendMessageMutation.mutate();
						}
					}}
				/>
				<button
					className='min-w-20 p-3 bg-light-blue-600 text-white'
					color='light-blue'
					onClick={() => sendMessageMutation.mutate()}
				>
					{sendMessageMutation.isPending ? (
						<Spinner {...({} as any)} />
					) : (
						<span>전송</span>
					)}
				</button>
			</div>
		</div>
	) : (
		<div className='w-full'></div>
	);
}
