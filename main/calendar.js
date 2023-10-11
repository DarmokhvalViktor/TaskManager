let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
let clock = document.getElementById("clock");

let todayButton = document.getElementById("today");
let goToDateInput = document.getElementById("goToDateInput");
let goToButton = document.getElementById("goToButton");
const todayDay = document.getElementsByClassName("todayDay")[0];
const todayDate = document.getElementsByClassName("todayDate")[0];
const todayTasksContainer = document.getElementsByClassName("todayTasksContainer")[0];

let activeDay = null;

const daysDiv = document.querySelector(".calendar-dates");

const currentMonthAndYear = document
    .querySelector(".calendar-current-date");


const calendar_prev = document.getElementById("calendar-prev");
const calendar_next = document.getElementById("calendar-next");

// Array of month names
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// Function to generate the calendar
const displayCalendar = () => {

    // Get the first day of the month
    let dayOfWeek = new Date(year, month, 0).getDay();

    // Get the last date of the month
    let lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    // Get the day of the last date of the month
    let lastDayOfWeek = new Date(year, month, lastDayOfMonth).getDay();

    // Get the last date of the previous month
    let previousMonthLastDate = new Date(year, month, 0).getDate();

    // Variable to store the generated calendar HTML
    let lit = "";

    // Loop to add the last dates of the previous month
    for (let i = dayOfWeek; i > 0; i--) {
        lit +=
            `<li class="previous day">${previousMonthLastDate - i + 1}</li>`;
    }

    // Loop to add the dates of the current month
    for (let i = 1; i <= lastDayOfMonth; i++) {

        // Check if the current date is today
        let isToday = i === date.getDate()
        && month === new Date().getMonth()
        && year === new Date().getFullYear()
            ? "active"
            : "";
        lit += `<li class="${isToday} day">${i}</li>`;
    }

    // Loop to add the first dates of the next month
    for (let i = lastDayOfWeek; i <= 6; i++) {
        lit += `<li class="next day">${i - lastDayOfWeek + 1}</li>`
    }

    // Update the text of the current date element
    // with the formatted current month and year
    currentMonthAndYear.innerText = `${months[month]} ${year}`;

    // update the HTML of the dates element
    // with the generated calendar
    // hideTodayButton();
    daysDiv.innerHTML = lit;
    selectDay();
}

displayCalendar();
//setting interval to update time, almost every second it re-using function createClock()
setInterval(createClock, 999);
// setInterval(createClock, 1);

//event on next button to display next month
calendar_next.addEventListener("click", nextMonth);
//event on previous button to display previous month
calendar_prev.addEventListener("click", previousMonth);

//re-displaying calendar for next month
function nextMonth() {
    // increase current month by one
    month++;
    if (month > 11) {
        // if month gets greater than 11 make it 0 and increase year by one
        month = 0;
        year++;
    }
    // rerender calendar
    displayCalendar();
}
//re-displaying calendar for previous month
function previousMonth() {
    // decrease current month by one
    month--;
    // check if let than 0 then make it 11 and decrease year
    if (month < 0) {
        month = 11;
        year--;
    }
    displayCalendar();
}

//function to hide button that redirects us to today's date
// function hideTodayButton() {
//     if (
//         month === new Date().getMonth() &&
//         year === new Date().getFullYear()
//     ) {
//         todayButton.style.display = "none";
//     } else {
//         todayButton.style.display = "flex";
//     }
// }

//adding event that monitors user's input, so it fits mm-yyyy requirements, delete backslash when deleting data by symbol
goToDateInput.addEventListener("input", (event) => {
    goToDateInput.value = goToDateInput.value.replace(/[^0-9/]/g, "");
    if (goToDateInput.value.length === 2) {
        goToDateInput.value += "/";
    }
    if (goToDateInput.value.length > 7) {
        goToDateInput.value = goToDateInput.value.slice(0,7);
    }
    if (event.inputType === "deleteContentBackward") {
        if (goToDateInput.value.length === 3) {
            goToDateInput.value = goToDateInput.value.slice(0, 2);
        }
    }
})

//function go to render calendar at date by user's input, alerts user if he enters invalid date or don't enter date at all
function goToDate() {
    const dateToGoArray = goToDateInput.value.split("/");
    if(dateToGoArray.length === 2) {
        if (dateToGoArray[0] > 0 && dateToGoArray[0] < 13 && dateToGoArray[1].length === 4) {
            month = dateToGoArray[0] - 1;
            year = dateToGoArray[1];
            displayCalendar();
            goToDateInput.value = "";
            return;
        }
    }
    if(dateToGoArray.length === 1) {
        alert("Please, enter month and year that you want to display")
    } else {
        alert("You have entered invalid date, please use month-year format, month value should not exceed 12, for example: 12/1999");
        goToDateInput.value = "";
    }
}
//if clicking on button, it executes function that rewrites calendar at date that user enter
goToButton.addEventListener("click", goToDate)

//add event on click on today button
todayButton.addEventListener("click", () => {
    month = date.getMonth();
    year = date.getFullYear();
    displayCalendar();
})
//TODO not displaying all tasks when page is loaded, only when reloaded.
//function that let user select day by clicking on it, and displays all tasks of that day
function selectDay() {
    const days = document.querySelectorAll(".day");
    days.forEach(day => {
        day.addEventListener("click", (event) => {
            console.log(event.target.innerHTML)
            displayToday(event.target.innerHTML);
            showTasks(+event.target.innerHTML);
            // activeDay = (+event.target.innerHTML);
            //remove active class from all days
            days.forEach(day => {
                day.classList.remove("active");
            });
            // if clicks on day of previous month switch to that month
            if(event.target.classList.contains("previous")) {
                previousMonth();
                const daysPrev = document.querySelectorAll(".day");
                daysPrev.forEach(day => {
                    if(!day.classList.contains("previous") && day.innerHTML === event.target.innerHTML) {
                        day.classList.add("active");
                    }
                });
            } else if (event.target.classList.contains("next")) {
                nextMonth();
                const daysNext = document.querySelectorAll(".day");
                daysNext.forEach(day => {
                    if(!day.classList.contains("next") && day.innerHTML === event.target.innerHTML) {
                        day.classList.add("active");
                    }
                });
            } else {
                event.target.classList.add("active");
            }
        })
    })
}

//function that displays chosen day and date
function displayToday(day) {
    const dayRes = new Date(year, month, day);
    const dayName = dayRes.toString().split(" ")[0];
    todayDay.innerHTML = dayName;
    todayDate.innerHTML = day + " " + months[month] + " " + year;
}
//TODO style tasks displayed, need to add scrollbar? if too many tasks
//function that shows all tasks of chosen day
function showTasks(day) {
    let tasks = "";
    tasksFromLocalStorage.forEach(task => {
        if(day === +task.dayTimeObject.day &&
        month + 1 === +task.dayTimeObject.month &&
        year === +task.dayTimeObject.year) {
            tasks += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${task.task}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${task.dayTimeObject.hours} + ":" + ${task.dayTimeObject.minutes}</span>
            </div>
        </div>`;
        }
    });
    console.log(tasksFromLocalStorage)
    if (tasks === "") {
        tasks = `<div class="no-event">
            <h3>No Tasks</h3>
        </div>`;
    }
    todayTasksContainer.innerHTML = tasks;
}

// //function update events when a day is active
// function updateEvents(date) {
//     let events = "";
//     eventsArr.forEach((event) => {
//         if (
//             date === event.day &&
//             month + 1 === event.month &&
//             year === event.year
//         ) {
//             event.events.forEach((event) => {
//                 events += `<div class="event">
//             <div class="title">
//               <i class="fas fa-circle"></i>
//               <h3 class="event-title">${event.title}</h3>
//             </div>
//             <div class="event-time">
//               <span class="event-time">${event.time}</span>
//             </div>
//         </div>`;
//             });
//         }
//     });
//     if (events === "") {
//         events = `<div class="no-event">
//             <h3>No Events</h3>
//         </div>`;
//     }
//     eventsContainer.innerHTML = events;
//     saveEvents();
// }

//function to create clock that displays current time on page
function createClock() {
    let date = new Date();
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hours = date.getHours();
    clock.textContent =
        "Time now is: " + ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2)
        + " Time zone: " + timeZone;
}