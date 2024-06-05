document.addEventListener('DOMContentLoaded', function() {
    const inputBox = document.getElementById('input-box');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    // Load saved todos from local storage
    loadTodos();

    // Add new todo
    addBtn.addEventListener('click', function() {
        const todoText = inputBox.value.trim();
        const todoDate = dateInput.value;

        if (todoText !== '' && todoDate !== '') { // Ensure both text and date are entered
            const now = new Date();
            const todo = {
                text: todoText,
                date: todoDate,
                time: now.toLocaleTimeString(),
                completed: false
            };
            addTodoItem(todo);
            saveTodoItem(todo);
            setReminder(todo); // Set reminder for this todo
            inputBox.value = '';
            dateInput.value = '';
        }
    });

    // Add todo item to the DOM
    function addTodoItem(todo) {
        const listItem = document.createElement('li');

        const details = document.createElement('div');
        details.classList.add('todo-details');
        details.innerHTML = `${todo.text} - ${todo.date} ${todo.time}`;

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

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = function() {
            todoList.removeChild(listItem);
            deleteTodoItem(todo);
        };

        buttons.appendChild(completeBtn);
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
        todos = todos.map(todo => (todo.text === updatedTodo.text && todo.date === updatedTodo.date && todo.time === updatedTodo.time) ? updatedTodo : todo);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Delete todo item from local storage
    function deleteTodoItem(deletedTodo) {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos = todos.filter(todo => !(todo.text === deletedTodo.text && todo.date === deletedTodo.date && todo.time === deletedTodo.time));
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Load todos from local storage and display them
    function loadTodos() {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => addTodoItem(todo));
    }

    // Function to set a reminder for a to-do item
    function setReminder(todo) {
        const reminderTime = new Date(todo.date + ' ' + todo.time);
        const currentTime = new Date();

        if (reminderTime > currentTime) {
            const timeUntilReminder = reminderTime - currentTime;
            setTimeout(() => {
                showReminderNotification(todo.text);
            }, timeUntilReminder);
        }
    }

    // Function to show a reminder notification
    function showReminderNotification(todoText) {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Reminder', {
                        body: 'Don\'t forget to: ' + todoText,
                        icon: 'icon.png'
                    });
                }
            });
        }
    }
});

