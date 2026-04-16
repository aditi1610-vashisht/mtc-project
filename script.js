const user=localStorage.getItem("plannerUser");
document.getElementById("welcome").innerText=user+"'s Planner";

let tasks=JSON.parse(localStorage.getItem("tasks"))||[];
let meds=JSON.parse(localStorage.getItem("meds"))||[];
let water=parseInt(localStorage.getItem("water"))||0;

/* CAT GREETING */
function greet(){
  const hour=new Date().getHours();
  let greetMsg="";

  if(hour<12) greetMsg="Good Morning ☀️";
  else if(hour<18) greetMsg="Good Afternoon 🌸";
  else greetMsg="Good Night 🌙";

  const quotes=[
    "You are doing amazing!",
    "Stay soft and strong.",
    "One task at a time.",
    "Small progress is still progress."
  ];

  const random=quotes[Math.floor(Math.random()*quotes.length)];
  document.getElementById("catMessage").innerText=
    greetMsg+" "+user+"! "+random;
}
greet();

/* TASKS */
function addTask(){
  const text = document.getElementById("taskInput").value;
  const date = document.getElementById("taskDate").value;
  const time = document.getElementById("taskTime").value; // new input field for time
  if(!text || !date || !time) return;

  tasks.push({ text, date, time, done:false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}


function renderTasks(){
  const list=document.getElementById("taskList");
  const doneList=document.getElementById("completedList");
  list.innerHTML="";
  doneList.innerHTML="";

  tasks.forEach((task,i)=>{
    const li=document.createElement("li");

if(!task.done){
  li.innerHTML = `${task.text} — ${task.date} at ${task.time}
    <button onclick="completeTask(${i})">⭐</button>`;
  list.appendChild(li);
}else{
  li.innerHTML = `${task.text} — ${task.date} at ${task.time} ⭐`;
  doneList.appendChild(li);
}

  });
}
function completeTask(i){
  tasks[i].done=true;
  localStorage.setItem("tasks",JSON.stringify(tasks));
  document.getElementById("sound").play();
  renderTasks();
}
renderTasks();

let events = JSON.parse(localStorage.getItem("events")) || {};
let selectedDay = null;

function renderCalendar(monthOffset = 0){
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";

  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  // Show header with month + year
  const header = document.createElement("h4");
  header.innerText = `${monthName} ${year}`;
  cal.appendChild(header);

  // Add weekday labels
  const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weekdayRow = document.createElement("div");
  weekdayRow.className = "weekday-row";
  weekdays.forEach(day=>{
    const wd = document.createElement("div");
    wd.className = "weekday";
    wd.innerText = day;
    weekdayRow.appendChild(wd);
  });
  cal.appendChild(weekdayRow);

  // Get number of days in this month
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = currentMonth.getDay(); // starting weekday (0=Sun)

  // Create grid for days
  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  // Empty slots before first day
  for(let i=0; i<firstDay; i++){
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    grid.appendChild(empty);
  }

  // Actual days
  for(let i=1; i<=daysInMonth; i++){
    const div = document.createElement("div");
    div.className = "calendar-day";
    div.innerText = i;

    if(events[i] && events[i].length > 0){
      div.classList.add("has-event");
    }

    div.onclick = function(){
      openModal(i);
    };

    grid.appendChild(div);
  }

  cal.appendChild(grid);
}


renderCalendar();

function openModal(day){
  selectedDay=day;
  document.getElementById("calendarModal").style.display="flex";
  document.getElementById("modalDate").innerText="Events on Day "+day;
  renderEvents();
}

function closeModal(){
  document.getElementById("calendarModal").style.display="none";
}

function addEvent(){
  const text=document.getElementById("eventInput").value;
  if(!text) return;

  if(!events[selectedDay]){
    events[selectedDay]=[];
  }

  events[selectedDay].push(text);
  localStorage.setItem("events",JSON.stringify(events));
  document.getElementById("eventInput").value="";
  renderEvents();
  renderCalendar();
}

function renderEvents(){
  const list=document.getElementById("eventList");
  list.innerHTML="";

  if(events[selectedDay]){
    events[selectedDay].forEach((ev,index)=>{
      const li=document.createElement("li");
      li.innerHTML=ev + 
      ` <button onclick="deleteEvent(${index})">❌</button>`;
      list.appendChild(li);
    });
  }
}

function deleteEvent(index){
  events[selectedDay].splice(index,1);
  localStorage.setItem("events",JSON.stringify(events));
  renderEvents();
  renderCalendar();
}

/* MEDICINE */
function addMedicine(){
  const name=document.getElementById("medName").value;
  const time=document.getElementById("medTime").value;
  if(!name||!time)return;

  meds.push({name,time,reminded:false});
  localStorage.setItem("meds",JSON.stringify(meds));
  renderMeds();
}
function renderMeds(){
  const list=document.getElementById("medList");
  list.innerHTML="";
  meds.forEach(m=>{
    const li=document.createElement("li");
    li.innerText=m.name+" at "+m.time;
    list.appendChild(li);
  });
}
renderMeds();

/* WATER */
let waterCount = 0;
const totalGlasses = 8;
const glassesContainer = document.getElementById("glasses");
const praiseText = document.getElementById("waterPraise");

// Create 8 glasses
for(let i=0;i<totalGlasses;i++){
  const glass = document.createElement("div");
  glass.classList.add("glass");
  glass.addEventListener("click", function(){
    fillGlass(glass);
  });
  glassesContainer.appendChild(glass);
}

function fillGlass(glass){
  if(glass.classList.contains("filled")) return;

  glass.classList.add("filled");
  waterCount++;

  givePraise();
}

function givePraise(){
  if(waterCount < 7){
    praiseText.innerText = `Great job! ${8-waterCount} glasses to go 💙`;
  }
  else if(waterCount === 7){
    praiseText.innerText = "Amazing! Just one more glass! 🌟";
  }
  else if(waterCount === 8){
    praiseText.innerText = "Hydration complete! You're glowing ⭐";
    showStarReward();
  }
}

function showStarReward(){
  const star = document.createElement("div");
  star.className="water-star";
  star.innerHTML="⭐ Hydration Star Earned!";
  document.body.appendChild(star);

  setTimeout(()=>{
    star.remove();
  },3000);
}
// Reminder Checker (runs every minute)
setInterval(checkReminders,60000);

function checkReminders(){
  const now = new Date();
  const currentTime = now.getHours() + ":" + String(now.getMinutes()).padStart(2,'0');

  // Check tasks
  tasks.forEach(task=>{
    if(task.time === currentTime && !task.reminded){
      showReminder(task.text);
      task.reminded = true;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });

  // Check medicines
  meds.forEach(med=>{
    if(med.time === currentTime && !med.reminded){
      showReminder("Time to take " + med.name + " 💊");
      med.reminded = true;
      localStorage.setItem("meds", JSON.stringify(meds));
      document.getElementById("sound").play(); // optional sound
    }
  });
}


function showReminder(text){
  document.getElementById("reminderText").innerText=text;
  document.getElementById("reminderPopup").style.display="block";
}

function closeReminder(){
  document.getElementById("reminderPopup").style.display="none";
}

  save();
  displayTasks();
  function getTagColor(tag){
  switch(tag){
    case "work": return "#007aff";
    case "study": return "#6e5ce6";
    case "health": return "#34c759";
    case "personal": return "#ff2d55";
    default: return "#ccc";
  }
}
function displayTasks(){
  const table = document.getElementById("taskTable");
  table.innerHTML = "";

  data.tasks.forEach((task,i)=>{

    const tagColor = getTagColor(task.tag);

    table.innerHTML += `
      <tr>
        <td>📝 ${task.title}</td>

        <td>
          <span style="
            background:${tagColor};
            color:white;
            padding:4px 8px;
            border-radius:6px;
            font-size:12px;">
            ${task.tag.toUpperCase()}
          </span>
        </td>

        <td>
          ${task.completed ? "✅" : "⏳"}
        </td>

        <td>
          <button onclick="completeTask(${i})">✔</button>
          <button onclick="deleteTask(${i})">🗑</button>
        </td>
      </tr>
    `;
  });

  updateProgressChart();
}
function showCatReminder(message){
  const popup = document.getElementById("catNotification");
  const text = document.getElementById("catMessage");

  text.innerText = message;
  popup.classList.remove("hidden");

  setTimeout(()=>{
    popup.classList.add("hidden");
  },4000);
}
function addReminder(){
  const time = document.getElementById("reminderTime").value;
  const text = document.getElementById("reminderText").value;

  if(!time || !text) return;

  data.reminders.push({time,text});
  save();
  displayReminders();
}
function displayReminders(){
  const list = document.getElementById("reminderList");
  list.innerHTML = "";

  data.reminders.forEach((r,i)=>{
    list.innerHTML += `
      <p>
        🕒 ${r.text} at ${r.time}
        <button onclick="editReminder(${i})">✏</button>
        <button onclick="deleteReminder(${i})">🗑</button>
      </p>
    `;
  });
}

function editReminder(i){
  const newText = prompt("Edit reminder text:", data.reminders[i].text);
  if(newText){
    data.reminders[i].text = newText;
    save();
    displayReminders();
  }
}

function deleteReminder(i){
  data.reminders.splice(i,1);
  save();
  displayReminders();
}
setInterval(()=>{
  const now = new Date().toISOString().slice(0,16);

  data.reminders.forEach((r,index)=>{
    if(r.time === now){
      showCatReminder("Reminder: " + r.text);
      data.reminders.splice(index,1);
      save();
    }
  });
},10000);
