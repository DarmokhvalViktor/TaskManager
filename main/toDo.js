let form = document.getElementById("new_task_form");
let input = document.getElementById("input_task");
let main_task_element = document.getElementById("main_tasks");
let tasksUl = document.createElement("ul");
tasksUl.classList.add("mainUl");
let h2Element = null;
let trash_div = null;

let tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks")) || [];

window.addEventListener("load", () => {
    if(tasksFromLocalStorage.length) {
        displayTasks();
    }
    let all_notes = document.querySelectorAll("li a");
    console.log(all_notes)

    all_notes.forEach(function (note, index) {
        note.addEventListener("keyup", function () {
            let note_content = this.querySelector("p").textContent;

            let item_key = "list_" + index;
            let data = {
                content: note_content
            };
            window.localStorage.setItem(item_key, JSON.stringify(data));
        });

        let data = JSON.parse(window.localStorage.getItem("list_" + index));
        if (data !== null) {
            note.querySelector("p").textContent = data.content;
        }
    });


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
    let liCounter = 0;
    tasksFromLocalStorage.forEach((element) => {
        createDivs(element.task,   ++liCounter);
    })
}

function createDivs(taskValue, liCounter) {

    let task_element = document.createElement("li");
    task_element.setAttribute("id",  "list_" + liCounter);
    task_element.setAttribute("draggable", "true");
    task_element.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("Text",event.target.id);
    } )
    task_element.classList.add("task");

    if(!trash_div) {
        trash_div = document.createElement("div");
        trash_div.classList.add("trashDiv");
        trash_div.addEventListener("drop", (event) => {
            event.preventDefault();
            let data=event.dataTransfer.getData("Text");
            let el = document.getElementById(data);
            el.parentNode.removeChild(el);
        });
        trash_div.addEventListener("dragover", (event) => {
            event.preventDefault();
        })
        tasksUl.append(trash_div);
    }

    let task_content_element = document.createElement("a");
    task_content_element.contentEditable = "true";
    task_content_element.classList.add("content");

    let parag = document.createElement("p");
    parag.classList.add("textInParagraph")
    parag.innerText = taskValue;
    task_content_element.append(parag);
    task_content_element.style.display = "block";


    task_element.appendChild(task_content_element);
    tasksUl.append(task_element);

    main_task_element.append(h2Element, tasksUl);

    // if(isCompleted) {
    //     task_element.classList.toggle("checked");
    //     task_content_element.classList.toggle("checked");
    // }

    // task_element.addEventListener("click", (event) => {
    //     event.preventDefault();
    //     task_element.classList.toggle("checked");
    //     task_content_element.classList.toggle("checked");
    //     let indexOfEl = tasksFromLocalStorage.findIndex(object => object.task === taskValue);
    //     tasksFromLocalStorage[indexOfEl].isCompleted = !tasksFromLocalStorage[indexOfEl].isCompleted;
    //     localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));
    //
    // });
    //TODO need to add time, when task is finished, like added when task is created.
    //TODO add verification that user can't add same task again.
//    TODO drag and drop stickers to delete

}

function submitTask() {
    let task = input.value;
    if(task) {
        createH2ElementIfNotPresent();

        createDivs( task, false);

        tasksFromLocalStorage.push({task: task, isCompleted: false});
        localStorage.setItem("tasks", JSON.stringify(tasksFromLocalStorage));

        input.value = "";
    }
}
function allowDrop(ev)
{
    ev.preventDefault();
}
function drag(ev)
{
    ev.dataTransfer.setData("Text",ev.target.id);
}
function drop(ev)
{
    ev.preventDefault();
    var data=ev.dataTransfer.getData("Text");
    var el = document.getElementById(data);
    el.parentNode.removeChild(el);
}
