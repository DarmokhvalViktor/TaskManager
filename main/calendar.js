let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
let clock = document.getElementById("clock");
let todayButton = document.getElementById("today");

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
const manipulate = () => {

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
            `<li class="inactive">${previousMonthLastDate - i + 1}</li>`;
    }

    // Loop to add the dates of the current month
    for (let i = 1; i <= lastDayOfMonth; i++) {

        // Check if the current date is today
        let isToday = i === date.getDate()
        && month === new Date().getMonth()
        && year === new Date().getFullYear()
            ? "active"
            : "";
        lit += `<li class="${isToday}">${i}</li>`;
    }

    // Loop to add the first dates of the next month
    for (let i = lastDayOfWeek; i <= 6; i++) {
        lit += `<li class="inactive">${i - lastDayOfWeek + 1}</li>`
    }

    // Update the text of the current date element
    // with the formatted current month and year
    currentMonthAndYear.innerText = `${months[month]} ${year}`;

    // update the HTML of the dates element
    // with the generated calendar
    hideTodayButton();
    daysDiv.innerHTML = lit;

}

manipulate();
//setting interval to update time, almost every second it re-using function createClock()
setInterval(createClock, 999);
// setInterval(createClock, 1);

//event on next button to display next month
calendar_next.addEventListener("click", () => {
    // increase current month by one
    month++;
    if (month > 11) {
        // if month gets greater than 11 make it 0 and increase year by one
        month = 0;
        year++;
    }
    // rerender calendar
    manipulate();
});
//event on previous button to display previous month
calendar_prev.addEventListener("click", () => {
    // decrease current month by one
    month--;
    // check if let than 0 then make it 11 and decrease year
    if (month < 0) {
        month = 11;
        year--;
    }
    manipulate();
});
//function to hide button that redirects us to today's date
function hideTodayButton() {
    if (
        month === new Date().getMonth() &&
        year === new Date().getFullYear()
    ) {
        todayButton.style.display = "none";
    } else {
        todayButton.style.display = "flex";
    }
}
//add event on click on today button
todayButton.addEventListener("click", () => {
    month = date.getMonth();
    year = date.getFullYear();
    manipulate();
})
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