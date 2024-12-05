document.addEventListener('DOMContentLoaded', () => {
    // Select sidebar buttons and sections
    const buttons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('section');
    
    // Profile Section Elements
    const page = document.querySelectorAll('.page');
    const profileSection = document.getElementById('profile');
    
    // Todo List Elements
    const addTodoButton = document.getElementById('add-todo');
    const todoName = document.getElementById('todo-name');
    const todoTime = document.getElementById('todo-time');
    const todoDescription = document.getElementById('todo-description');
    const doingList = document.getElementById('doing-items');
    const finishedList = document.getElementById('finished-items');

    // Task Section Elements
    const taskNameInput = document.getElementById('task-name');
    const taskDatetimeInput = document.getElementById('task-datetime');
    const taskDescriptionInput = document.getElementById('task-description');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    // Calendar Section Elements
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const calendarGrid = document.getElementById('calendar-grid');
    const monthTitle = document.getElementById('month-title');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const backToMonthButton = document.getElementById('back-to-month');

    // Study Timer Section Elements
    const timerContainer = document.querySelector('.timer-container');

    // Summary Section Elements
    const summarySection = document.getElementById('summary');

    // Sidebar Navigation Logic
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            sections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.add('active');
        });
    });

    // -----------Profile Section: This is static data, just showing user details-----------
    const profileInfo = {
        name: "Nhat Thanh Le",
        email: "nhat@example.com",
        dob: "2000-01-01"
    };

    // Update the profile section dynamically
    const updateProfile = () => {
        profileSection.innerHTML = `
            <h3>Profile</h3>
            <div class="profile-info">
                <p>Name: ${profileInfo.name}</p>
                <p>Email: ${profileInfo.email}</p>
                <p>Date of Birth: ${profileInfo.dob}</p>
            </div>
        `;
    };
    updateProfile();

    // -----------Todo List Section: Handling "Doing" and "Finished" tasks-----------

    const todoList = document.getElementById('todo-list');

    // Add a new task when the Add Task button is clicked
    addTodoButton.addEventListener('click', () => {
        const taskName = todoName.value;
        const taskTime = todoTime.value;
        const taskDescription = todoDescription.value;

        if (taskName && taskTime && taskDescription) {
            let formattedTime = taskTime; // Default to input value
            const dueDate = new Date(taskTime);
            if (!isNaN(dueDate)) {
                formattedTime = dueDate.toLocaleString('en-US', {
                    weekday: 'short',  // e.g., Mon, Tue
                    month: 'short',    // e.g., Jan, Feb
                    day: 'numeric',    // e.g., 1, 2
                    hour: '2-digit',   // e.g., 03, 15
                    minute: '2-digit', // e.g., 05, 59
                });
            }
            // Create task item
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');

            // Add checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');

            // Add task text
            const taskText = document.createElement('div');
            taskText.classList.add('task-text');
            taskText.innerHTML = `
                <strong>${taskName}</strong><br>
                Due: ${formattedTime}<br>
                ${taskDescription}
            `;

            // Add delete button
            const deleteButton = document.createElement('i');
            deleteButton.classList.add('bx', 'bx-x', 'delete-task');

            // Delete button event listener
            deleteButton.addEventListener('click', () => {
                todoList.removeChild(taskItem); // Remove the task item
            });

            // Append elements to the task item
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteButton);

            // Checkbox event listener
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    taskText.classList.add('completed');
                } else {
                    taskText.classList.remove('completed');
                }
            });

            // Append task item to the todo list
            todoList.appendChild(taskItem);

            // Clear input fields
            todoName.value = '';
            todoTime.value = '';
            todoDescription.value = '';
        }
    });
    
    
    // -----------Task Section: Simple task input and list display-----------
    let tasks = []; // Array to store tasks
    let editTaskId = null;

    // Function to add or update a task
    addTaskButton.addEventListener('click', () => {
        const name = taskNameInput.value.trim();
        const datetime = taskDatetimeInput.value; // ISO 8601 format (YYYY-MM-DDTHH:MM)
        const description = taskDescriptionInput.value.trim();

        if (name && datetime && description) {
            if (editTaskId !== null) {
                // Update existing task
                const taskIndex = tasks.findIndex(task => task.id === editTaskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex].name = name;
                    tasks[taskIndex].datetime = datetime;
                    tasks[taskIndex].description = description;

                    updateCalendarDay(tasks[taskIndex]);
                }
                editTaskId = null; // Reset editTaskId
                addTaskButton.textContent = "Add Task"; // Reset button text
            } else {
                // Add new task
                const task = {
                    id: Date.now(), // Unique ID based on timestamp
                    name,
                    datetime,
                    description,
                };


                tasks.push(task);
            }

            renderTasks(); // Update the task list display
            generateMonthlyCalendar(); //********** */

            // Clear input fields
            taskNameInput.value = '';
            taskDatetimeInput.value = '';
            taskDescriptionInput.value = '';
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Attach event listeners to edit and remove buttons
    function renderTasks() {
        taskList.innerHTML = ''; // Clear existing tasks

        tasks.forEach(task => {
            // Get the task template
            const template = document.getElementById('task-template');
            const taskClone = template.content.cloneNode(true);

            // Populate task data
            taskClone.querySelector('.task-name').textContent = task.name;

            const formattedDatetime = new Date(task.datetime).toLocaleString('en-US', {
                dateStyle: 'short',
                timeStyle: 'short',
            });
            taskClone.querySelector('.task-datetime').textContent = formattedDatetime;

            taskClone.querySelector('.task-description').textContent = task.description;

            // Add task ID to buttons
            const editButton = taskClone.querySelector('.edit-task');
            const removeButton = taskClone.querySelector('.remove-task');
            editButton.setAttribute('data-id', task.id);
            removeButton.setAttribute('data-id', task.id);

            // Add event listeners for editing and removing tasks
            editButton.addEventListener('click', () => editTask(task.id));
            removeButton.addEventListener('click', () => removeTask(task.id));

            // Append the task to the task list
            taskList.appendChild(taskClone);
        });
    }

    // Edit Task
    function editTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            // Pre-fill the input fields with task details
            taskNameInput.value = task.name;
            taskDatetimeInput.value = task.datetime;
            taskDescriptionInput.value = task.description;

            editTaskId = taskId; // Set the task ID to track the edit
            addTaskButton.textContent = "Update Task"; // Update button text
        }
    }

    // Remove Task
    function removeTask(taskId) {
        const taskToRemove = tasks.find(task => task.id === taskId); // Remove task from array
        if(taskToRemove){
            tasks = tasks.filter(task => task.id !== taskId);   
            renderTasks(); // Update the task list display
            updateCalendarDay(taskToRemove);
        }
    }

    function updateCalendarDay(task) {
        const taskDate = new Date(task.datetime);
        const day = taskDate.getDate();
        const month = taskDate.getMonth();
        const year = taskDate.getFullYear();
    
        // Check if the task belongs to the current calendar view
        if (month === currentMonth && year === currentYear) {
            const dayCells = document.querySelectorAll('.calendar-day');
            dayCells.forEach(dayCell => {
                if (parseInt(dayCell.textContent) === day) {
                    // Clear existing content
                    dayCell.innerHTML = day;
    
                    // Add tasks for the day
                    const tasksForDay = tasks.filter(t => {
                        const tDate = new Date(t.datetime);
                        return (
                            tDate.getFullYear() === currentYear &&
                            tDate.getMonth() === currentMonth &&
                            tDate.getDate() === day
                        );
                    });
    
                    // Append task tags to the day cell
                    tasksForDay.forEach(task => {
                        const taskTag = document.createElement('div');
                        taskTag.classList.add('task-tag');
                        taskTag.textContent =
                            task.name.length > 10 ? task.name.substring(0, 10) + '...' : task.name; // Truncate if too long
                        dayCell.appendChild(taskTag);
                    });
                }
            });
        }
    }
    


    // -----------Calendar Section: Placeholder for the calendar-----------

    // Helper function to get the days in a month
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Helper function to get the first day of the month
    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }

    // Global variables for the calendar
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDay = null;

    // Function to generate the monthly view
    function generateMonthlyCalendar() {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const grid = document.getElementById('calendar-grid');
        grid.innerHTML = ''; // Clear existing content

        // Update the month title
        const monthTitle = document.getElementById('month-title');
        monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        //Hide the Back icon
        const backToMonthIcon = document.getElementById('back-to-month');
        backToMonthIcon.classList.add('hidden'); // Explicitly hide the icon

        // Display empty slots for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            grid.appendChild(emptyCell);
        }


        // Display all days in the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;
            dayCell.classList.add('calendar-day');
            dayCell.addEventListener('click', () => generateDailyCalendar(day));
            // Check if tasks exist for the day
            const tasksForDay = tasks.filter(task => {
                const taskDate = new Date(task.datetime);
                return (
                    taskDate.getFullYear() === currentYear &&
                    taskDate.getMonth() === currentMonth &&
                    taskDate.getDate() === day
                );
            });

            // Add a tag for each task
            tasksForDay.forEach(task => {
                const taskTag = document.createElement('div');
                taskTag.classList.add('task-tag');
                taskTag.textContent =
                    task.name.length > 10 ? task.name.substring(0, 10) + '...' : task.name; // Truncate name if too long
                dayCell.appendChild(taskTag);
            });

            grid.appendChild(dayCell);
        }
    }

    // Function to switch to the previous or next month
    function switchMonth(direction) {
        currentMonth += direction;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateMonthlyCalendar();
    }

    // Function to generate a daily view
    function generateDailyCalendar(day) {
        selectedDay = day;
        const grid = document.getElementById('calendar-grid');
        grid.innerHTML = ''; // Clear existing content

        // Update the grid class for daily view
        grid.classList.remove('calendar-grid');
        grid.classList.add('daily-grid');

        // Show the Back to Month icon
        const backToMonthIcon = document.getElementById('back-to-month');
        backToMonthIcon.classList.remove('hidden'); // Show the icon

        // Update the title to show the selected day
        const monthTitle = document.getElementById('month-title');
        monthTitle.textContent = `Day View - ${monthNames[currentMonth]} ${day}, ${currentYear}`;

        // Check if tasks exist for the hour
        const tasksForDay = tasks.filter(task => {
            const taskDate = new Date(task.datetime);
            return (
                taskDate.getFullYear() === currentYear &&
                taskDate.getMonth() === currentMonth &&
                taskDate.getDate() === day 
            );
        });
        // Generate hourly slots for the day
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            timeSlot.textContent = `${hour}:00`;

            // Fetch tasks for the hour
            const tasksForHour = tasksForDay.filter(task => {
                const taskDate = new Date(task.datetime);
                return taskDate.getHours() === hour;
            });

            // Add task tags to the time slot
            tasksForHour.forEach(task => {
                const taskTag = document.createElement('div');
                taskTag.classList.add('task-tag');
                taskTag.textContent =
                    task.name.length > 10 ? task.name.substring(0, 10) + '...' : task.name; // Truncate if too long
                timeSlot.appendChild(taskTag);
            });

            grid.appendChild(timeSlot);
        }
    }
    // Back to month functionality
    document.getElementById('back-to-month').addEventListener('click', () => {
        // Set the grid back to monthly view
        const grid = document.getElementById('calendar-grid');
        grid.classList.remove('daily-grid');
        grid.classList.add('calendar-grid');

        // Call the monthly calendar generation function
        generateMonthlyCalendar();

        // Hide the Back to Month icon
        const backToMonthIcon = document.getElementById('back-to-month');
        backToMonthIcon.classList.add('hidden'); // Hide back icon when in monthly view
    });

    // Function to switch to the previous or next month
    function switchMonth(direction) {
        currentMonth += direction;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateMonthlyCalendar();
    }

    // Add event listeners for month navigation
    document.getElementById('prev-month').addEventListener('click', () => switchMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => switchMonth(1));

    // Initialize the calendar with the current month
    generateMonthlyCalendar();


    // -----------Study Timer Section: Simple study timer (placeholder logic)-----------
    let startBtn = document.getElementById('start');
    let stopBtn = document.getElementById('stop');
    let resetBtn = document.getElementById('reset');
    
    let hour = 0;
    let minute = 0;
    let second = 0;
    let count = 0;
    
    startBtn.addEventListener('click', function () {
        timer = true;
        stopWatch();
    });
    
    stopBtn.addEventListener('click', function () {
        timer = false;
    });
    
    resetBtn.addEventListener('click', function () {
        timer = false;
        hour = 0;
        minute = 0;
        second = 0;
        count = 0;
        document.getElementById('hr').innerHTML = "00";
        document.getElementById('min').innerHTML = "00";
        document.getElementById('sec').innerHTML = "00";
        document.getElementById('count').innerHTML = "00";
    });
    
    function stopWatch() {
        if (timer) {
            count++;
    
            if (count == 100) {
                second++;
                count = 0;
            }
    
            if (second == 60) {
                minute++;
                second = 0;
            }
    
            if (minute == 60) {
                hour++;
                minute = 0;
                second = 0;
            }
    
            let hrString = hour;
            let minString = minute;
            let secString = second;
            let countString = count;
    
            if (hour < 10) {
                hrString = "0" + hrString;
            }
    
            if (minute < 10) {
                minString = "0" + minString;
            }
    
            if (second < 10) {
                secString = "0" + secString;
            }
    
            if (count < 10) {
                countString = "0" + countString;
            }
    
            document.getElementById('hr').innerHTML = hrString;
            document.getElementById('min').innerHTML = minString;
            document.getElementById('sec').innerHTML = secString;
            document.getElementById('count').innerHTML = countString;
            setTimeout(stopWatch, 10);
        }
    }
    // -----------Summary Section: Placeholder for future summary content-----------
    const updateSummary = () => {
        summarySection.innerHTML = `
            <h3>Summary</h3>
            <p>Content to be updated...</p>
        `;
    };
    updateSummary();

    // -----------Initialize Dashboard with Profile Section Active-----------
    profileSection.classList.add('active');
});
