'use client'

import { IconButton, Checkbox, Spinner } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteTodo, updateTodo } from '@/actions/todo-actions'
import { queryClient } from '@/config/ReactQueryClientProvider';

export default function Todo({todo}) {
	const [isEditing, setIsEditing] = useState(false)
	const [completed, setCompleted] = useState(todo.completed);
	const [title, setTitle] = useState(todo.title);

	const { mutate: fetchUpdate, isPending } = useMutation({
    mutationFn: () =>
			updateTodo({
				id: todo.id,
        title,
        completed,
      }),
		onSuccess: () => {
			queryClient.invalidateQueries({
        queryKey: ['todos'],
			});
			setIsEditing(false);
		},
	});
	
	const { mutate: fetchDelete, isPending: isPendingDelete } = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      });
    },
  });
	

	return (
    <div className='w-full flex items-center gap-1'>
      <Checkbox
        {...({
          checked: completed,
          onChange: () => {
            setCompleted((prev: boolean) => !prev);
            fetchUpdate();
          },
        } as any)}
      />
      {isEditing ? (
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='flex-1 outline-none border-b-black border-b pb-2'
        />
      ) : (
        <p className={`flex-1 ${completed && 'line-through'}`}>{title}</p>
      )}
      <IconButton
        {...({
          onClick: () => {
            if (isEditing) fetchUpdate();
            setIsEditing(prev => !prev);
          },
        } as any)}
      >
        {isPending ? (
          <Spinner {...({} as any)} />
        ) : (
          <i className={`fas fa-${isEditing ? 'check' : 'pen'}`} />
        )}
      </IconButton>
      <IconButton {...({ onClick: () => fetchDelete() } as any)}>
				{isPendingDelete ? (
					<Spinner {...({} as any)} />
				) : (
					<i className='fas fa-trash' />
				)}
      </IconButton>
    </div>
  );
}