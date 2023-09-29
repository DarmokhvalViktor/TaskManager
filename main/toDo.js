let form = document.getElementById("new_task_form");
let input = document.getElementById("input_task");
let main_task_element = document.getElementById("main_tasks");
let tasksUl = document.createElement("ul");
let h2Element = null;

let tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks")) || [];

window.addEventListener("load", () => {
    if(tasksFromLocalStorage.length) {
        displayTasks();
    }
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitTask();
    })
    input.addEventListener("keypress", (event) => {
        if(event.key === "Enter") {
            event.preventDefault();
            submitTask();
        }
    })
})

function editTask(task_edit_button, task_input_text) {
    let dateNow = getDateNow();
    if(task_edit_button.innerText.toLowerCase() === "edit") {
        task_edit_button.innerText = "Save";
        task_input_text.removeAttribute("readonly");
        task_input_text.focus();
        indexOfTask = tasksFromLocalStorage.find((object) => object.task === task_input_text.value);
    } else {
        task_edit_button.innerText = "Edit";
        task_input_text.setAttribute("readonly", "readonly");
        tasksFromLocalStorage[indexOfTask] = {task: task_input_text.value, date: dateNow, isCompleted: false};
        localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));
    }
}

function createH2ElementIfNotPresent() {
    if(!h2Element) {
        h2Element = document.createElement("h2");
        h2Element.innerText = "Tasks:";
        createDeleteButton();
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

function displayTasks() {
    createH2ElementIfNotPresent();
    tasksFromLocalStorage.forEach((element) => {
        createDivs(element.task,  "Task creation date: " + element.date, element.isCompleted);
    })
}

function createDivs(taskValue, dateValue, isCompleted) {
    let task_element = document.createElement("li");
    task_element.classList.add("task");

    let task_content_element = document.createElement("div");
    task_content_element.classList.add("content");

    let date_element = document.createElement("div");
    date_element.classList.add("dateElement");
    date_element.innerText = dateValue;

    let taskAndButtonDiv = document.createElement("div");
    taskAndButtonDiv.classList.add("taskAndButtonDiv");


    let task_input_text = document.createElement("input");
    task_input_text.classList.add("text");
    task_input_text.type = "text";
    task_input_text.value = taskValue;
    task_input_text.setAttribute("readonly", "readonly");
    task_content_element.appendChild(task_input_text);

    let task_button_holder = document.createElement("div");
    task_button_holder.classList.add("task_button_holder");

    let task_edit_button = document.createElement("button");
    task_edit_button.classList.add("edit");
    task_edit_button.innerText = "Edit";

    let task_delete_button = document.createElement("button");
    task_delete_button.classList.add("delete");
    task_delete_button.innerText = "Delete";

    task_button_holder.append(task_edit_button, task_delete_button)

    taskAndButtonDiv.append(task_content_element, task_button_holder)
    task_element.prepend(date_element);
    task_element.append(taskAndButtonDiv);
    tasksUl.append(task_element);
    // task_element.append(task_content_element);
    // tasksUl.append(task_element, task_button_holder);

    main_task_element.append(h2Element, tasksUl);

    if(isCompleted) {
        task_element.classList.toggle("checked");
        task_input_text.classList.toggle("checked");
        date_element.classList.toggle("checked");
    }

    task_element.addEventListener("click", (event) => {
        event.preventDefault();
        task_element.classList.toggle("checked");
        task_input_text.classList.toggle("checked");
        date_element.classList.toggle("checked");
        let indexOfEl = tasksFromLocalStorage.findIndex(object => object.task === taskValue);
        tasksFromLocalStorage[indexOfEl].isCompleted = !tasksFromLocalStorage[indexOfEl].isCompleted;
        localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));

    });
    //TODO need to add time, when task is finished, like added when task is created.
    //TODO add verification that user can't add same task again.

    task_edit_button.addEventListener("click", () => {
        editTask(task_edit_button, task_input_text);
    });
    task_delete_button.addEventListener("click", () => {
        tasksUl.removeChild(task_element);
        let indexOfEl = tasksFromLocalStorage.indexOf(dateValue);
        tasksFromLocalStorage.splice(indexOfEl, 1);
        localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));
    });
}
function getDateNow() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDay();
    let year = date.getFullYear()
    let hour= date.getHours();
    let min= ("0" + date.getMinutes()).slice(-2);
    let sec= date.getSeconds();
    return year + "-" + month  + "-" + day + "___" + hour + ":" + min + ":" + sec;
}

function submitTask() {
    let task = input.value;
    if(task) {
        createH2ElementIfNotPresent();

        let dateNow = getDateNow();
        createDivs( task, `Task creation date: ` + dateNow, false);

        tasksFromLocalStorage.push({task: task, date: dateNow, isCompleted: false});
        localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));

        input.value = "";
    }

}