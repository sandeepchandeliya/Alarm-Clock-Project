// Selecting elements from the HTML document
const displayTime = document.querySelector("#current-time");
const selectHours = document.querySelector("#hours");
const selectMinutes = document.querySelector("#minutes");
const selectSeconds = document.querySelector("#seconds");
const selectAmPm = document.querySelector("#am-pm");
const submitButton = document.querySelector("#submitButton");
const alarmsContainer = document.querySelector("#alarms-container");

// Dropdown menu with options 
window.addEventListener("DOMContentLoaded", () => {
  populateDropDown(1, 12, selectHours);
  populateDropDown(0, 59, selectMinutes);
  populateDropDown(0, 59, selectSeconds);

  setInterval(updateCurrentTime, 1000);
  loadAlarms();
});

// event listener for alarm submission button 
submitButton.addEventListener("click", handleAlarmSubmission);

// function to populate dropdown
function populateDropDown(start, end, element) {
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? "0" + i : i;
    option.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(option);
  }
}
// to update and display current time
function updateCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  displayTime.innerHTML = time;

  return time;
}
// function to handle submission
function handleAlarmSubmission(e) {
  e.preventDefault();
  const selectedHour = selectHours.value;
  const selectedMinute = selectMinutes.value;
  const selectedSecond = selectSeconds.value;
  const selectedAmPm = selectAmPm.value;

  const alarmTime = convertToTime(selectedHour, selectedMinute, selectedSecond, selectedAmPm);
  setAlarm(alarmTime);
}

// function to convert selected time 
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}
// set alarm function 
function setAlarm(time, isFetching = false) {
  const alarmInterval = setInterval(() => {
    if (time === updateCurrentTime()) {
      alert("Alarm is Ringing");
    }
    console.log("running");
  }, 500);

  addAlarmToDOM(time, alarmInterval);
  if (!isFetching) {
    saveAlarm(time);
  }
}
// to add new alarm to DOM
function addAlarmToDOM(time, intervalId) {
  const alarmElement = document.createElement("div");
  alarmElement.classList.add("alarm", "mb", "flex");
  alarmElement.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
  `;
  const deleteButton = alarmElement.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmsContainer.prepend(alarmElement);
}

//  to load saved alarms from local storage
function loadAlarms() {
  const savedAlarms = getStoredAlarms();

  savedAlarms.forEach((time) => {
    setAlarm(time, true);
  });
}
// to get saved alarms from local storage
function getStoredAlarms() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}
// to save a new alarm to local storage
function saveAlarm(time) {
    const alarms = getStoredAlarms();
    alarms.push(time);
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }
  
  // to delete an alarm from the DOM and local storage
  function deleteAlarm(event, time, intervalId) {
    const target = event.target;
    clearInterval(intervalId);
  
    const alarmElement = target.parentElement;
    console.log(time);
  
    deleteAlarmFromStorage(time);
    alarmElement.remove();
  }
  
  function deleteAlarmFromStorage(time) {
    const alarms = getStoredAlarms();
    const index = alarms.indexOf(time);
    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }

