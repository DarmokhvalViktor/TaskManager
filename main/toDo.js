let form = document.getElementById("new_task_form");
let inputTask = document.getElementById("input_task");
let inputDayAndTime = document.getElementById("pickADateAndTime");
let inputTaskImportance = document.getElementById("task_importance");
let main_task_element = document.getElementById("main_tasks");
let tasksUl = document.createElement("ul");
tasksUl.classList.add("mainUl");
let h2Element = null;
let trash_div = null;
let liCounter = 0;

let tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks")) || [];

window.addEventListener("load", () => {
    if(tasksFromLocalStorage.length) {
        displayTasks();
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitTask();
    })
    inputTask.addEventListener("keypress", (event) => {
        if(event.key === "Enter") {
            event.preventDefault();
            submitTask();
        }
    });
})

function createH2ElementIfNotPresent() {
    if(!h2Element) {
        h2Element = document.createElement("h2");
        h2Element.innerText = "Tasks:";
        createDeleteButton();
        createSortButton();
        createSortByTimeButton();
        createTrashDiv();
    }
}
function createDeleteButton() {
    let deleteAllTasksButton = document.createElement("button");
    deleteAllTasksButton.innerText = "Delete all tasks";
    deleteAllTasksButton.classList.add("deleteAllTasks");
    deleteAllTasksButton.addEventListener("click", () => {
        tasksFromLocalStorage = [];
        localStorage.clear();
        location.reload();
    });
    h2Element.appendChild(deleteAllTasksButton);
}

function createSortButton() {
    let sortButton = document.createElement("button");
    sortButton.innerText = `Sort tasks by priority`;
    sortButton.classList.add("sortButton");
    h2Element.appendChild(sortButton);
    sortButton.addEventListener("click", () => {
        sortTaskByPriority(tasksFromLocalStorage);
        displayTasks();
    })
}
function createSortByTimeButton() {
    let sortByTimeButton = document.createElement("button");
    sortByTimeButton.innerText = `Sort tasks by date`;
    sortByTimeButton.classList.add("sortByTimeButton");
    h2Element.appendChild(sortByTimeButton);
    sortByTimeButton.addEventListener("click", () => {
        sortTasksByDate(tasksFromLocalStorage);
        displayTasks();
    })
}

function displayTasks() {
    createH2ElementIfNotPresent();
    tasksUl.innerText = "";

    tasksFromLocalStorage.forEach((element) => {
        createDivs(element.task,   element.priority, element.dayTimeObject, liCounter);
    })
    localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));
}

function createTrashDiv() {
    trash_div = document.createElement("div");
    trash_div.classList.add("trashDiv");
    trash_div.addEventListener("drop", (event) => {
        event.preventDefault();
        let data= event.dataTransfer.getData("Text");
        let el = document.getElementById(data);
        let valueToDelete = el.childNodes[0].childNodes[2].textContent;
        tasksFromLocalStorage = tasksFromLocalStorage.filter(task => task.task !== valueToDelete);
        localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));
        el.parentNode.removeChild(el);
    });
    trash_div.addEventListener("dragover", (event) => {
        event.preventDefault();
    })
    h2Element.append(trash_div);
}
function prioritizeTask(taskPriority) {
    switch (taskPriority) {
        case 0:
            return "urgent";
        case 1:
            return "important";
        case 2:
            return "medium";
        case 3:
            return "low";
    }
}

//Sorts tasks by priority
function sortTaskByPriority(tasksArray) {
    tasksArray.sort((a, b) => a.priority.priorityNumber - b.priority.priorityNumber);
}

//function that sort tasks by their deadline date
function sortTasksByDate(tasksArray) {
    tasksArray.sort((a, b) => {
        let aDayTime = a.dayTimeObject;
        let bDayTime = b.dayTimeObject;
        let aDate = transformDate(aDayTime);
        let bDate = transformDate(bDayTime);

        return new Date(aDate) - new Date(bDate)
    });
}

//Transforms date from dd-mm-yyyy format to mm-dd-yyyy
function transformDate(date) {
    let transformed = date.split(/\W/);
    return transformed[1] + "-" + transformed[0] + "-" + transformed[2] + " " + transformed[3] + ":" + transformed[4];
}

let count = 0;
//function that creates blocks that hold tasks
function createDivs(taskValue, taskPriority, dayAndTimeObject) {

    let taskPrior = prioritizeTask(taskPriority.priorityNumber)
    let task_element = document.createElement("li");
    task_element.setAttribute("draggable", "true");
    task_element.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("Text",event.target.id);
    });
    task_element.setAttribute("id", "List_" + liCounter++);
    task_element.classList.add("task");

    let task_content_element = document.createElement("a");
    // task_content_element.contentEditable = "true";
    task_content_element.classList.add("content");
    task_content_element.classList.add(taskPrior)

    let dateAndTime = document.createElement("div");
    dateAndTime.classList.add("dateAndTimeDiv");

    if(Date.now() > new Date(transformDate(dayAndTimeObject)).getTime()) {
        console.log("Expired")
        task_content_element.classList.add("expired")
    } else {
        console.log("Not expired")
        task_content_element.classList.remove("expired")
    }

    dayAndTimeObject = dayAndTimeObject.split(" ");
    dateAndTime.innerHTML = `Deadline:` + `<br/>` + dayAndTimeObject[0] + `<br/>` + dayAndTimeObject[1];

    let priorityElem = document.createElement("div");
    priorityElem.classList.add("priorityElem");
    priorityElem.innerText = `Priority: ` + taskPrior;

    let parag = document.createElement("p");
    parag.classList.add("textInParagraph")
    parag.innerText = taskValue;
    task_content_element.append(dateAndTime, priorityElem, parag);
    task_content_element.style.display = "block";


    task_element.appendChild(task_content_element);
    tasksUl.append(task_element);

    main_task_element.append(h2Element, tasksUl);

}

//function that let us create new task, call function createDivs to draw task or tasks if there are more than one
// on page and adds task to browser local storage
function submitTask() {
    let task = inputTask.value;
    let dayAndTime = inputDayAndTime.value;
    let taskPriority = {priorityNumber: parseInt(inputTaskImportance.options[inputTaskImportance.selectedIndex].value),
        priorityText: inputTaskImportance.options[inputTaskImportance.selectedIndex].text};

    if(task) {
        createH2ElementIfNotPresent();

        createDivs( task, taskPriority, dayAndTime);

        tasksFromLocalStorage.push({task: task, priority: taskPriority, dayTimeObject: dayAndTime});
        localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));

        inputTask.value = "";
        inputDayAndTime.value = "";
        inputTaskImportance.value = "";
    }
}
//flatpickr library, using to let user not type date and time, but choose from expanding window
$("#pickADateAndTime").flatpickr({enableTime: true, dateFormat: "d-m-Y H:i", allowInput: true, time_24hr: true,
    "locale": {
        "firstDayOfWeek": 1}
});
