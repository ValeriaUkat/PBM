const tasks = [];
let deferredPrompt;

navigator.serviceWorker.register("dummy-sw.js");

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.style.display = "none";
  });
  document.getElementById(pageId).style.display = "block";

  if (pageId === "tasks") displayTasks();
  if (pageId === "dashboard") updateDashboard();
}

function addTask(event) {
  event.preventDefault();
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const priority = document.getElementById("taskPriority").value;

  const newTask = {
    title,
    description,
    priority,
    completed: false,
  };

  tasks.push(newTask);
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskPriority").value = "";

  displayTasks();
  updateDashboard();
}

function displayTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
      <div class="task-header">
        <input type="checkbox" onchange="toggleCompletion(${index})" ${
      task.completed ? "checked" : ""
    }>
        <div class="task-title">${task.title}</div>
        <div class="task-meta">
          <span class="priority-badge priority-${task.priority}">${
      task.priority
    }</span>
        </div>
      </div>
      <div class="task-description">${task.description}</div>
    `;
    taskList.appendChild(taskItem);
  });
}

function toggleCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  updateDashboard();
  displayTasks();
}

function updateDashboard() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high"
  ).length;

  document.getElementById("totalTasks").innerText = totalTasks;
  document.getElementById("completedTasks").innerText = completedTasks;
  document.getElementById("pendingTasks").innerText = pendingTasks;
  document.getElementById("highPriorityTasks").innerText = highPriorityTasks;

  const highPriorityList = document.getElementById("highPriorityList");
  highPriorityList.innerHTML = "";
  tasks
    .filter((task) => task.priority === "high")
    .forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item high-priority";
      taskItem.innerHTML = `
      <div class="task-header">
        <div class="task-title">${task.title}</div>
        <div class="task-meta"><span class="priority-badge priority-high">Tinggi</span></div>
      </div>
      <div class="task-description">${task.description}</div>
    `;
      highPriorityList.appendChild(taskItem);
    });
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBanner").style.display = "flex";
});

document.getElementById("installBtn").addEventListener("click", () => {
  if (deferredPrompt) {
    const customDialog = document.getElementById("customInstallDialog");
    customDialog.style.display = "flex";

    document.getElementById("installConfirmBtn").onclick = function () {
      customDialog.style.display = "none";
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Aplikasi diinstal.");
        } else {
          console.log("Instalasi dibatalkan.");
        }
        deferredPrompt = null;
      });
    };

    document.getElementById("installCancelBtn").onclick = function () {
      customDialog.style.display = "none";
    };
  }
});
