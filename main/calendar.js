let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let clock = document.getElementById("clock");

const day = document.querySelector(".calendar-dates");

const currentDate = document
    .querySelector(".calendar-current-date");

const prenexIcons = document
    .querySelectorAll(".calendar-navigation span");

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
    currentDate.innerText = `${months[month]} ${year}`;

    // update the HTML of the dates element
    // with the generated calendar
    day.innerHTML = lit;
}

manipulate();
setInterval(createClock, 1);

// Attach a click event listener to each icon
prenexIcons.forEach(icon => {

    // When an icon is clicked
    icon.addEventListener("click", () => {

        // Check if the icon is "calendar-prev"
        // or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        // Check if the month is out of range
        if (month < 0 || month > 11) {

            // Set the date to the first day of the
            // month with the new year
            date = new Date(year, month, new Date().getDate());

            // Set the year to the new year
            year = date.getFullYear();

            // Set the month to the new month
            month = date.getMonth();
        }

        else {

            // Set the date to the current date
            date = new Date();
        }

        // Call the manipulate function to
        // update the calendar display
        manipulate();
    });
});

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