const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// Get tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editId = null;

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add or Update Task
function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        alert("Please enter a task!");
        return;
    }

    if (editId !== null) {
        const task = tasks.find(task => task.id === editId);

        task.title = title;

        editId = null;
        addBtn.textContent = "Add Task";

    } else {
        const newTask = {
            id: Date.now(),
            title: title,
            completed: false
        };

        tasks.push(newTask);
    }

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Edit Task
function editTask(id) {
    const task = tasks.find(task => task.id === id);

    taskInput.value = task.title;

    editId = id;
    addBtn.textContent = "Update Task";
}

// Mark Task as Completed
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const span = document.createElement("span");
        span.textContent = task.title;
        span.className = "task-text";

        if (task.completed) {
            span.classList.add("completed");
        }

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit";

        editBtn.addEventListener("click", () => {
            editTask(task.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete";

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        actions.append(editBtn, deleteBtn);

        li.append(checkbox, span, actions);

        taskList.appendChild(li);
    });

    if (tasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty">No tasks available!</p>';
    }

    // Update statistics
    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
}

// Event Listener
addBtn.addEventListener("click", addTask);

// Initial Rendering
renderTasks();