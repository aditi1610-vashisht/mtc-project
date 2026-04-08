// Firebase Init (Paste same config here)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(user=>{
    if(!user) window.location="index.html";
    else loadTasks(user.uid);
});

// ADD TASK (User specific)
function addTask(){
    let user = auth.currentUser;

    db.collection("tasks").add({
        uid: user.uid,
        title: document.getElementById("title").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        status:"pending"
    });

    alert("Task Added");
}


function renderToday(){
  const list = document.getElementById("todayList");
  list.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  tasks.forEach((task,index)=>{
    if(task.date === today){

      const li = document.createElement("li");
      li.className = "today-line";

      li.innerHTML = `
        <span>${task.text}</span>
        <button onclick="completeTask(${index})">✔</button>
      `;

      list.appendChild(li);
    }
  });
}
// HABIT SAVE
function saveHabit(){
    let user=auth.currentUser;

    db.collection("habits").add({
        uid:user.uid,
        steps:document.getElementById("steps").value,
        medicine:document.getElementById("medicine").value,
        date:new Date()
    });

    alert("Habit Saved");
}

// CHART
function renderChart(completed,pending){
    new Chart(document.getElementById("taskChart"),{
        type:"doughnut",
        data:{
            labels:["Completed","Pending"],
            datasets:[{
                data:[completed,pending],
                backgroundColor:["#00f2fe","#ff6a88"]
            }]
        }
    });
}

function logout(){
    auth.signOut();
}
const notesBox = document.getElementById("notesBox");

// Load saved notes
notesBox.value = localStorage.getItem("notes") || "";

// Save on typing
notesBox.addEventListener("input", () => {
    localStorage.setItem("notes", notesBox.value);
});
let task = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        list.innerHTML += `
            <li>
                ${task}
                <button onclick="deleteTask(${index})">❌</button>
            </li>
        `;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    if (input.value.trim() === "") return;

    tasks.push(input.value);
    input.value = "";
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}


const notes = document.getElementById("notesBox");

notes.value = localStorage.getItem("notes") || "";

notes.addEventListener("input", () => {
    localStorage.setItem("notes", notes.value);
});


const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskContainer");
const filter = document.getElementById("categoryFilter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


    taskContainer.innerHTML = "";

    let selected = filter.value;

    let filteredTasks = tasks.filter(t => {
        return selected === "All" || t.category === selected;
    });
 
    
    filteredTasks.forEach((task, index) => {
        const div = document.createElement("div");
        div.classList.add("task-card");

        div.innerHTML = `
            <div class="task-left">
                <span class="${task.done ? 'done' : ''}">
                    ${task.text}
                </span>
                <span class="category">${task.category}</span>
            </div>

            <div>
                <button onclick="toggleTask(${index})">✔</button>
                <button onclick="deleteTask(${index})">❌</button>
            </div>
        `;

        taskContainer.appendChild(div);
    });

    

