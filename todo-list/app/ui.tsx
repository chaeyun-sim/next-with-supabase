'use client'

import { Button, Input } from '@material-tailwind/react';
import Todo from '@/components/todo';
import { ChangeEvent, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createTodo as createTodoAction, getTodos } from '@/actions/todo-actions';
import { queryClient } from '@/config/ReactQueryClientProvider';

export default function UI() {
	const [searchInput, setSearchInput] = useState('')

	const { data: todos, isPending: isFetchPending } = useQuery({
		queryKey: ['todos'],
		queryFn: () => getTodos({searchInput})
	})

	const { mutate: addTodo, isPending: isCreatePending } = useMutation({
    mutationFn: () =>
      createTodoAction({
        title: `투두 ${todos.length + 1}`,
        completed: false,
      }),
		onSuccess: () => {
			queryClient.invalidateQueries({
        queryKey: ['todos'],
      });
		},
	});
	
	return (
    <div className='w-2/3 mx-auto flex flex-col items-center py-10 gap-2'>
      <h1 className='text-xl'>TODO LIST</h1>

      <Input
        {...({
          label: 'Search TODO',
          placeholder: 'Search TODO',
          icon: <i className='fas fa-search' />,
          value: searchInput,
          onChange: (e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value),
        } as any)}
      />

      {todos &&
        todos.map(todo => (
          <Todo
            key={todo.id}
            todo={todo}
          />
        ))}

      {isFetchPending && <p>Loading...</p>}

      <Button
        {...({
          onClick: () => addTodo(),
          loading: isCreatePending,
        } as any)}
      >
        <i className='fas fa-plus mr-2' />
        ADD TODO
      </Button>
    </div>
  );
}