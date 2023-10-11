//select form block, mainly to save task when use button\or press "enter"
let form = document.getElementById("new_task_form");
//select text of the new task
let inputTask = document.getElementById("input_task");
//select date and time of the new task
let inputDayAndTime = document.getElementById("pickADateAndTime");
//select priority of the new task
let inputTaskImportance = document.getElementById("task_importance");
//select block that holds header with button sort\delete\trash icon\block with all tasks
let main_task_element = document.getElementById("main_tasks");
//select block with all tasks
let tasksUl = document.createElement("ul");
tasksUl.classList.add("mainUl");
//I don't need those elements when there is no tasks assigned, so when starting program assigning them to null,
// and after creating when it needed
let h2Element = null;
let trash_div = null;
let liCounter = 0;

//Get any stored info from LS, else use empty array
let tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks")) || [];

//On page load display if any task is already set, else only calendar + form to submit new task
window.addEventListener("load", () => {
    //check if any task is stored already then display on page
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
//function to create header that holds sort and delete buttons, using when displaying\creating task
function createH2ElementIfNotPresent() {
    if(!h2Element) {
        h2Element = document.createElement("h2");
        h2Element.innerText = "Tasks:";
        createDeleteButton();
        createSortByPriorityButton();
        createSortByDeadlineButton();
        createTrashDiv();
    }
}

//function to create button that delets all tasks
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

//function to create button that sort tasks by priority
function createSortByPriorityButton() {
    let sortButton = document.createElement("button");
    sortButton.innerText = `Sort tasks by priority`;
    sortButton.classList.add("sortByPriorityButton");
    h2Element.appendChild(sortButton);
    sortButton.addEventListener("click", () => {
        sortTaskByPriority(tasksFromLocalStorage);
        displayTasks();
    })
}

//function to create button that sort tasks by time of their deadline
function createSortByDeadlineButton() {
    let sortByTimeButton = document.createElement("button");
    sortByTimeButton.innerText = `Sort tasks by date`;
    sortByTimeButton.classList.add("sortByTimeButton");
    h2Element.appendChild(sortByTimeButton);
    sortByTimeButton.addEventListener("click", () => {
        sortTasksByDeadline(tasksFromLocalStorage);
        displayTasks();
    })
}

//function that executed when page is loaded or task is created\deleted, re-displaying all tasks
function displayTasks() {
    createH2ElementIfNotPresent();
    tasksUl.innerText = "";

    tasksFromLocalStorage.forEach((element) => {
        createDivs(element.task,   element.priority, element.dayTimeObject, liCounter);
    })
    localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));
}

//function that creates block for task and display it on page
function createTrashDiv() {
    trash_div = document.createElement("div");
    trash_div.classList.add("trashDiv");

    //add event that allows to drag'n'drop task in trash_div to delete task
    trash_div.addEventListener("drop", (event) => {
        event.preventDefault();
        $(event.target).attr("drop-active", true);

        let data= event.dataTransfer.getData("Text");
        let el = document.getElementById(data);

        let valueToDelete = el.childNodes[0].childNodes[2].textContent;
        //TODO deletes all tasks with the same content inside, need to change somehow
        tasksFromLocalStorage = tasksFromLocalStorage.filter(task => task.task !== valueToDelete);
        //TODO with includes or not?
        tasksFromLocalStorage.includes()
        let string = [];
        string.includes()

        localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));
        el.parentNode.removeChild(el);
    });

    trash_div.addEventListener("dragleave", (event) => {
        $(event.target).removeAttr("drop-active");
    })

    trash_div.addEventListener("dragover", (event) => {
        event.preventDefault();
        $(event.target).attr("drop-active", true);
    })
    h2Element.append(trash_div);
}

//function that take value priority from input and adds corresponding class to allow css style it
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
function sortTasksByDeadline(tasksArray) {
    tasksArray.sort((a, b) => {
        let aDayTime = a.dayTimeObject;
        let bDayTime = b.dayTimeObject;
        let aDate2 = new Date(+aDayTime.year, +aDayTime.month,
            +aDayTime.day, +aDayTime.hours, +aDayTime.minutes);
        let bDate2 = new Date(+bDayTime.year, +bDayTime.month,
            +bDayTime.day, +bDayTime.hours, +bDayTime.minutes);
        return aDate2 - bDate2
    });
}

//Transforms date from dd-mm-yyyy format to mm-dd-yyyy
function transformDate(date) {
    let transformed = date.split(/\W/);
    return transformed[1] + "-" + transformed[0] + "-" + transformed[2] + " " + transformed[3] + ":" + transformed[4];
}

//NOT sure why do I need this counter for
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

    //TODO check for different approach on edit content
    //this should make content editable, but i'm not sure if it is necessity or there is a better approach
    // task_content_element.contentEditable = "true";
    task_content_element.classList.add("content");
    task_content_element.classList.add(taskPrior)

    let dateAndTime = document.createElement("div");
    dateAndTime.classList.add("dateAndTimeDiv");

    if(new Date().getTime() > new Date(+dayAndTimeObject.year, +dayAndTimeObject.month - 1,+dayAndTimeObject.day,
        +dayAndTimeObject.hours, +dayAndTimeObject.minutes).getTime()) {
        console.log("Expired")
        task_content_element.classList.add("expired")
    } else {
        console.log("Not expired")
        task_content_element.classList.remove("expired")
    }

    dayAndTimeObject = [dayAndTimeObject.day, dayAndTimeObject.month, dayAndTimeObject.year, dayAndTimeObject.hours, dayAndTimeObject.minutes]
    dateAndTime.innerHTML = `Deadline:` + `<br/>` + dayAndTimeObject[0] + "-" + dayAndTimeObject[1] + "-" + dayAndTimeObject[2] +
         `<br/>` + dayAndTimeObject[3] + ":" + dayAndTimeObject[4];

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

//function that let us create new task, call createDivs() to draw task or tasks if there are more than one
// on page and adds task to browser local storage
function submitTask() {
    let task = inputTask.value;
    let dayAndTime = inputDayAndTime.value;
    let transformedDateArray = dayAndTime.split(/\W/);
    console.log(transformedDateArray)
    let dateAndTimeObject = {
        day : transformedDateArray[0],
        month: transformedDateArray[1],
        year : transformedDateArray[2],
        hours : transformedDateArray[3],
        minutes : transformedDateArray[4]
    }
    let taskPriority =
        {priorityNumber: parseInt(inputTaskImportance.options[inputTaskImportance.selectedIndex].value),
        priorityText: inputTaskImportance.options[inputTaskImportance.selectedIndex].text};

    if(task) {
        createH2ElementIfNotPresent();

        createDivs( task, taskPriority, dateAndTimeObject);

        tasksFromLocalStorage.push({task: task, priority: taskPriority, dayTimeObject: dateAndTimeObject});
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
