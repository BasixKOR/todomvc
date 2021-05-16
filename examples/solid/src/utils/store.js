import { createState, createEffect, createContext, produce } from 'solid-js';

function id() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function createLocalState(initState) {
  const [state, setState] = createState(initState);
  if (localStorage.todos) setState(JSON.parse(localStorage.todos));
  createEffect(() => localStorage.setItem('todos', JSON.stringify(state)));
  return [state, setState];
}

export const TodosContext = createContext([{ todos: [] }, {}]);

export function TodosProvider(props) {
  const [state, setState] = createLocalState({
		todos: []
	})

	const store = [
		state,
		{
			addTodo(title) {
				setState('todos', todos => [...todos, { id: id(), title, completed: false }]);
			},
			removeTodo(id) {
				setState('todos', todos => todos.filter(todo => todo.id !== id));
			},
			setIsTodoCompleted(id, completed) {
				setState('todos', todos => todos.map(todo => todo.id === id ? {...todo, completed} : todo));
			},
			clearCompleted() {
				setState('todos', todos => todos.filter(todo => !todo.completed))
			},
			toggleCompleted() {
				setState('todos', todos => todos.map(todo => ({...todo, completed: !todo.completed})))
			},
			editTodo(id, title) {
				setState('todos', produce(todos => {
					todos.find(todo => todo.id === id).title = title;
				}));
				// TODO: Fix to not use produce while keeping TodoItem's own internal state.
			}
		}
	];

  return (
    <TodosContext.Provider value={store}>
      {props.children}
    </TodosContext.Provider>
  );
};
