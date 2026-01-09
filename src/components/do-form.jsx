import React, { useState, useEffect } from 'react';

// форма для создания задач
function Form() {
    const [inputTask, setInputTask] = useState('');

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
    }, [list]);

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
                todo: todo
            };
            setList([...list, newTask]);
            setInputTask('');
        }
    };

    // удалить задачу
    const handleDeleteTodo = (id) => {
        const newList = list.filter((todo) => todo.id != id);
        setList(newList);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Предотвращаем отправку формы
            handleAddTodo(e);
        }
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
                </div>
                <ul className="mt-6">
                    {list.map((todo) => (
                        <li className="bg-white rounded-lg p-4 mb-3 shadow-sm 
                  hover:shadow-md transition-all duration-300
                  border border-gray-100 hover:border-blue-200 flex flex-row" key={todo.id}>
                            <p div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">{todo.todo}</p>
                            <button className="relative bg-white text-transparent bg-clip-text 
                   bg-gradient-to-r from-blue-600 to-purple-600
                   px-6 py-3 rounded-lg font-bold
                   border-2 border-transparent
                   hover:bg-gradient-to-r hover:from-bl0ue-600 hover:to-purple-600 
                   hover:text-blue transition-all duration-30" onClick={() => handleDeleteTodo(todo.id)}>удалить</button></li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Form;
