document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");

  // Load tasks from localStorage
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      addTask(task.text, task.completed, false);
    });
    toggleEmptyState();
  };

  // Save tasks to localStorage
  const saveTasks = () => {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((li) => {
      const task = {
        text: li.querySelector("span").textContent,
        completed: li.classList.contains("completed"),
      };
      tasks.push(task);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const toggleEmptyState = () => {
    emptyImage.style.display =
      taskList.children.length === 0 ? "block" : "none";
  };

  const addTask = (text, completed = false, save = true) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) {
      return;
    }

    const li = document.createElement("li");
    li.draggable = true;
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
      <span>${taskText}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
    }

    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
      li.classList.toggle("completed", isChecked);
      saveTasks(); // Save after each checkbox change
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmptyState();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      saveTasks(); // Save after deletion
    });

    li.addEventListener("dragstart", () => {
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
    });

    taskList.appendChild(li);
    taskInput.value = "";
    save && saveTasks();
    toggleEmptyState();
  };

  addTaskBtn.addEventListener("click", () => addTask());
  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });

  // Allow task dragging and reordering
  taskList.addEventListener("dragover", (event) => {
    event.preventDefault();
    const dragging = document.querySelector(".dragging");
    const allTasks = [...taskList.querySelectorAll("li")];
    const afterElement = getDragAfterElement(taskList, event.clientY);
    if (afterElement == null) {
      taskList.appendChild(dragging);
    } else {
      taskList.insertBefore(dragging, afterElement);
    }
  });

  const getDragAfterElement = (taskList, y) => {
    const draggableElements = [
      ...taskList.querySelectorAll("li:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  loadTasks();
});
