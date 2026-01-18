import { ListStart } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

// форма для создания задач
function Form() {
    const [inputTask, setInputTask] = useState('');
    // Рабочий метод сохранения localStorage
    const [deleteList, setDeleteList] = useState(() => {
        const saved = localStorage.getItem('deleteList');
        console.log("Loading from localstorage:", saved);
        return saved ? JSON.parse(saved) : [];
    });
    const [editingID, setEditingID] = useState(null);
    const [EditTask, setEditTask] = useState('');
    const [showArchive, setShowArchive] = useState(false);

    const [list, setList] = useState(() => {
        const saved = localStorage.getItem('list');
        console.log("Loading from localstorage:", saved);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const saveDos = localStorage.getItem('list');
        if (saveDos) {
            setList(JSON.parse(saveDos))
        }
    }, []);

    // Сохраняем задачи в localStorage при каждом изменении
    useEffect(() => {
        localStorage.setItem('list', JSON.stringify(list));
        console.log('✅ list обновился в состоянии:', list);
    }, [list]);

    useEffect(() => {
        localStorage.setItem('deleteList', JSON.stringify(deleteList));
    }, [deleteList]);

    useEffect(() => {
        console.log('deleteList обновился:', deleteList);
    }, [deleteList]);

    const handleInputChange = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setInputTask(event.target.value);
    };

    //добавляем задачу
    const handleAddTodo = (todo) => {
        const prov = todo.trim();
        if (prov.length < 1) {
            console.log('Введите хотя бы один символ')
        } else {
            const newTask = {
                id: Math.random(),
                todo: todo,
                completed: false,
                deteted: [],
            };
            setList([...list, newTask]);
            setInputTask('');
        }
    };

    const handleEditDo = (id) => {
        setList(list.map((task) => task.id === id ? { ...task, todo: EditTask } : task))
        setEditingID(null);
        setEditTask('')
    }

    // удалить задачу из основного пула
    const handleDeleteTodo = (id) => {
        const newList = list.filter((todo) => todo.id !== id);
        setList(newList);
    }

    const handleDeleteTodoArch = (id) => {
        const newDelList = deleteList.filter((todo) => todo.id !== id);
        setDeleteList(newDelList);
    }


    // const toggle = (id) => {
    //     setList(list.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
    // }

    const toggleArch = useCallback((id) => {
        const task = deleteList.find(t => t.id === id);
        if (!task) return;
        const updatedTask = { ...task, completed: !task.completed };
        // делаем отображение для чека
        setList(prev => prev.map(t => t.id === id ? updatedTask : t));
        setTimeout(() => {
            const taskElement = document.getElementById(`task-update-${id}`);
            if (taskElement) {
                taskElement.style.transition = 'all 0.5s';
                taskElement.style.transform = 'translateY(100px)';
                taskElement.style.opacity = '0';
            }
            setTimeout(() => {
                setDeleteList(prev => prev.filter(t => t.id !== id))
                setList(prev => [...prev, updatedTask])
            }, 300)
        }, 300)
    }, [deleteList]);

    const HandleCheck = useCallback((id) => {
        const task = list.find(t => t.id === id);
        if (!task) return;
        const updatedTask = { ...task, completed: !task.completed };
        // делаем отображение для чека
        setList(prev =>
            prev.map(t => t.id === id ? updatedTask : t)
        );
        setTimeout(() => {
            const taskElement = document.getElementById(`task-${id}`);
            if (taskElement) {
                taskElement.style.transition = 'all 0.5s';
                taskElement.style.transform = 'translateX(100px)';
                taskElement.style.opacity = '0';
            }
            setTimeout(() => {
                setDeleteList(prev => [...prev, updatedTask])
                setList(prev => prev.filter(t => t.id !== id));
            }, 500);
        }, 300)
    }, [list]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Предотвращаем отправку формы
            handleAddTodo(e);
        }
    };

    const ArchiveStore = () => {
        return (
            <div className='archive-block'>
                <ul className="mt-6">
                    {deleteList.map((todo) => (
                        <li id={`task-update-${todo.id}`} className="bg-white rounded-lg p-4 mb-3 shadow-sm 
                  hover:shadow-md transition-all duration-300
                  border border-gray-100 hover:border-blue-200 flex flex-row justify-between items-center" key={todo.id}>
                            <input type="checkbox" checked={todo.completed} onClick={() => toggleArch(todo.id)} />
                            <p div className="relative bg-white text-transparent bg-clip-text 
                   bg-gradient-to-r from-blue-600 to-purple-600
                   px-6 py-3 rounded-lg font-bold
                   border-2 border-transparent
                   hover:bg-gradient-to-r hover:from-bl0ue-600 hover:to-purple-600 
                   hover:text-blue transition-all duration-30">{todo.todo}</p>
                            <button className="relative bg-white text-transparent bg-clip-text 
                   bg-gradient-to-r from-blue-600 to-purple-600
                   px-6 py-3 rounded-lg font-bold
                   border-2 border-transparent
                   hover:bg-gradient-to-r hover:from-bl0ue-600 hover:to-purple-600 
                   hover:text-blue transition-all duration-30" onClick={() => handleDeleteTodoArch(todo.id)}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg></button>
                        </li>))}
                </ul></div>
        )
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4" >
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">My To-Do List | Список дел</h1>
                <div div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full flex">
                    <input className="border border-black-200 rounded-lg text-black-600 text-sm animate-fadeIn w-full px-3 py-2 focus:outline-none" type="text" value={inputTask}
                        onChange={handleInputChange} onKeyUp={handleKeyPress} placeholder="Enter a task" minlength="1"
                    />
                    <button className="relative bg-white text-transparent bg-clip-text 
                   bg-gradient-to-r from-blue-600 to-purple-600
                   px-6 py-3 rounded-lg font-bold
                   border-2 border-transparent
                   hover:bg-gradient-to-r hover:from-bl0ue-600 hover:to-purple-600 
                   hover:text-blue transition-all duration-30" onClick={() => { handleAddTodo(inputTask) }}>Добавить</button>
                    <button onClick={() => setShowArchive(!showArchive)} className='text-2xl px-6 py-3'>🗑️</button>
                </div>
                {showArchive && ArchiveStore()}
                <ul className="mt-6">
                    {list.map((todo) => (
                        <li id={`task-${todo.id}`} className="bg-white rounded-lg p-4 mb-3 shadow-sm 
                  hover:shadow-md transition-all duration-300
                  border border-gray-100 hover:border-blue-200 flex flex-row justify-between items-center" key={todo.id}>
                            {/* Режим редактирования ИЛИ отображение */}
                            {editingID === todo.id ? (
                                // Поле ввода при редактировании
                                <input
                                    type="text"
                                    value={EditTask}
                                    onChange={(e) => setEditTask(e.target.value)}
                                    onBlur={() => handleEditDo(todo.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleEditDo(todo.id);
                                        if (e.key === 'Escape') setEditingID(null);
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <input type="checkbox" checked={todo.completed} onChange={() => HandleCheck(todo.id)} />
                                    <p div className="relative bg-white text-transparent bg-clip-text 
                   bg-gradient-to-r from-blue-600 to-purple-600
                   px-6 py-3 rounded-lg font-bold
                   border-2 border-transparent
                   hover:bg-gradient-to-r hover:from-bl0ue-600 hover:to-purple-600 
                   hover:text-blue transition-all duration-30">{todo.todo}</p>
                                    <div className="right-buttons flex gap-2">
                                        <button className="px-4 py-2 bg-white-500 text-white" onClick={() => {
                                            setEditingID(todo.id);
                                            setEditTask(todo.todo);
                                            console.log(todo.completed)
                                        }}>
                                            ✏️
                                        </button>
                                        <button className="px-4 py-2 bg-white-500 text-white" onClick={() => handleDeleteTodo(todo.id)}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg></button></div></>)}</li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Form;
