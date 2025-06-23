const tasks = [];
let deferredPrompt; // Variabel untuk menyimpan event prompt
navigator.serviceWorker.register("dummy-sw.js");

// Menampilkan halaman yang sesuai berdasarkan pageId
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.style.display = "none"; // Sembunyikan semua halaman
  });

  const activePage = document.getElementById(pageId);
  activePage.style.display = "block"; // Tampilkan halaman aktif

  if (pageId === "tasks") {
    displayTasks();
  }
  if (pageId === "dashboard") {
    updateDashboard();
  }
}
// Add a new task to the tasks array
function addTask(event) {
  event.preventDefault();

  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const priority = document.getElementById("taskPriority").value;

  const newTask = {
    title: title,
    description: description,
    priority: priority,
    completed: false,
  };

  tasks.push(newTask);

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskPriority").value = "";

  displayTasks();
  updateDashboard();
}

// Display all tasks in the task list
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
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    }</span>
        </div>
      </div>
      <div class="task-description">${task.description}</div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Toggle task completion status
function toggleCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  updateDashboard();
  displayTasks();
}

// Update the dashboard with task statistics
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
        <div class="task-meta">
          <span class="priority-badge priority-high">Tinggi</span>
        </div>
      </div>
      <div class="task-description">${task.description}</div>
    `;
      highPriorityList.appendChild(taskItem);
    });
}
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBanner").style.display = "block"; // Tampilkan banner
});

document.getElementById("installBtn").addEventListener("click", () => {
  if (deferredPrompt) {
    const customDialog = document.getElementById("customInstallDialog");
    customDialog.style.display = "block"; // Tampilkan dialog konfirmasi

    document.getElementById("installConfirmBtn").onclick = function () {
      customDialog.style.display = "none"; // Sembunyikan dialog
      deferredPrompt.prompt(); // Tampilkan prompt instal
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Pengguna menerima prompt instal");
        } else {
          console.log("Pengguna menolak prompt instal");
        }
        deferredPrompt = null; // Kosongkan deferredPrompt
      });
    };

    document.getElementById("installCancelBtn").onclick = function () {
      customDialog.style.display = "none"; // Sembunyikan dialog
      console.log("Pengguna menolak untuk menginstal aplikasi.");
    };
  }
});
