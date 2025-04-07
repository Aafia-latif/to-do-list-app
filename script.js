document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addBtn = document.getElementById("add-btn");
  const taskList = document.getElementById("task-list");

  const createTask = (taskText) => {
    const li = document.createElement("li");
    li.className = "task";

    li.innerHTML = `
      <input type="checkbox" />
      <span>${taskText}</span>
      <button class="edit">✏️</button>
      <button class="delete">🗑️</button>
    `;

    const checkbox = li.querySelector("input[type='checkbox']");
    const editBtn = li.querySelector(".edit");
    const deleteBtn = li.querySelector(".delete");
    const span = li.querySelector("span");

    checkbox.addEventListener("change", () => {
      li.classList.toggle("completed", checkbox.checked);
    });

    editBtn.addEventListener("click", () => {
      taskInput.value = span.textContent;
      li.remove();
    });

    deleteBtn.addEventListener("click", () => {
      li.remove();
    });

    taskList.appendChild(li);
  };

  addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      createTask(taskText);
      taskInput.value = "";
    }
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });
});
