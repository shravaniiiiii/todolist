document.addEventListener('DOMContentLoaded', function() {
    const taskTitleInput = document.getElementById('task-title');
    const taskTextInput = document.getElementById('task-text');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    // Load saved todos from local storage
    loadTodos();

    // Add new todo
    addBtn.addEventListener('click', function() {
        const taskTitle = taskTitleInput.value.trim();
        const taskText = taskTextInput.value.trim();
        const taskDate = dateInput.value;

        if (taskTitle !== '' && taskDate !== '') { // Ensure title and date are entered
            const now = new Date();
            const todo = {
                title: taskTitle,
                text: taskText,
                date: taskDate,
                time: now.toLocaleTimeString(),
                completed: false
            };
            addTodoItem(todo);
            saveTodoItem(todo);
            taskTitleInput.value = '';
            taskTextInput.value = '';
            dateInput.value = '';
        }
    });

    // Add todo item to the DOM
    function addTodoItem(todo) {
        const listItem = document.createElement('li');

        const details = document.createElement('div');
        details.classList.add('todo-details');
        details.innerHTML = `<h3>${todo.title}</h3><p>${todo.text}</p><p>${todo.date} ${todo.time}</p>`;

        const buttons = document.createElement('div');
        buttons.classList.add('buttons');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.classList.add('complete-btn');
        completeBtn.onclick = function() {
            todo.completed = !todo.completed;
            listItem.classList.toggle('completed', todo.completed);
            updateTodoItem(todo);
        };

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.onclick = function() {
            const newTitle = prompt('Enter new title:', todo.title);
            if (newTitle !== null) {
                todo.title = newTitle;
                updateTodoItem(todo);
                details.innerHTML = `<h3>${todo.title}</h3><p>${todo.text}</p><p>${todo.date} ${todo.time}</p>`;
            }
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = function() {
            todoList.removeChild(listItem);
            deleteTodoItem(todo);
        };

        buttons.appendChild(completeBtn);
        buttons.appendChild(editBtn);
        buttons.appendChild(deleteBtn);

        listItem.appendChild(details);
        listItem.appendChild(buttons);
        todoList.appendChild(listItem);
        listItem.classList.toggle('completed', todo.completed);
    }

    // Save todo item to local storage
    function saveTodoItem(todo) {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Update todo item in local storage
    function updateTodoItem(updatedTodo) {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos = todos.map(todo => (todo.title === updatedTodo.title && todo.date === updatedTodo.date && todo.time === updatedTodo.time) ? updatedTodo : todo);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Delete todo item from local storage
    function deleteTodoItem(deletedTodo) {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos = todos.filter(todo => !(todo.title === deletedTodo.title && todo.date === deletedTodo.date && todo.time === deletedTodo.time));
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Load todos from local storage and display them
    function loadTodos() {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => addTodoItem(todo));
    }
});


