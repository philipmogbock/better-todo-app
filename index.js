// get element that holds list of tasks aka get the Ul
const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const clearTasksButton = document.querySelector("[data-clear-complete-task-button]");

const listDisplayContainer = document.querySelector("[data-list-display-container]");
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const taskContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");

const newTaskForm = document.querySelector("[data-new-task-form")
const newTaskInput = document.querySelector("[data-new-task-input")

// unique name space to stop overriding 
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
// key for selectedList  in local storage
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
// get lists from lcoal storage if it exists and parse it into an object if it doesnt exist set it to empty array
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
// get selected list 
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


// create an array that will hold  all the list items/objects
// let lists = ['Youtube', 'Work','Groceries'];
// let lists = ['none', 'bob','dishes'];
// let lists = [{id:1,name:'none'},{id:2,name:'bob'},{id:3,name:'dishes'}];

// add event listener to entire container so you can tell when list item clicked, instead of adding to each list item 
listsContainer.addEventListener("click", (e)=>{
    if(e.target.tagName.toLowerCase() === "li" ){
        selectedListId = e.target.dataset.listId
        // console.log(`selectedListId=${selectedListId}`) 
        // console.log(`listId=${e.target.dataset.listId}`) 
        saveAndRender()

    }
})

taskContainer.addEventListener("click", (e)=>{
    if(e.target.tagName.toLowerCase() === "input" ){
        const selectedList = lists.find(list => list.id === selectedListId)
        selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete=e.target.checked 
        saveAndRender()
    }
})


deleteListButton.addEventListener("click",(e)=>{
    lists = lists.filter(list=>list.id!==selectedListId)

    // console.log("im clicked")
    selectedListId= null
    saveAndRender()
} )

clearTasksButton.addEventListener("click",(e)=>{
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)

    // console.log("im clicked")
    saveAndRender()
} )


newListForm.addEventListener("submit",(e)=>{
    // prevent page from submitting when you click button 
    e.preventDefault();
    // get name of element typed in (the name of the list element)
    const listName = newListInput.value
    // check if name was passed in if not then dont do anything 
    if(listName == null || listName === '') return
    // create list object with name given 
    const list = createList(listName)
    //clear list input so new input can be made
    newListInput.value = null
    // add list to the end of lists array 
    lists.push(list)

    saveAndRender()

})

newTaskForm.addEventListener("submit",(e)=>{
    // prevent page from submitting when you click button 
    e.preventDefault();
    // get name of element typed in (the name of the task element)
    const taskName = newTaskInput.value
    // check if name was passed in if not then dont do anything 
    if(taskName == null || taskName === '') return
    // create task object with name given 
    const task = createTask(taskName)
    //clear task input so new input can be made
    newTaskInput.value = null
    // add task to selected list
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    
    saveAndRender()

})

// function returns an object with unique id and given name and list of tasks associated with each list initially empty
function createList(name){
    // return {id: Date.now().toString(), name:name, tasks:[{id:"bob",name:"hello",complete:true}]}
    return {id: Date.now().toString(), name:name, tasks:[]}
}

function createTask(name){
    return {id: Date.now().toString(), name:name, complete: false}
}

// save lists in localStorage 
function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY,selectedListId)
}



function render(){
     //first clear the list 
    clearElement(listsContainer);
    //  loop through list of lists and create li element for each
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)
    // dont display list of tasks in list if no list is selected 
    if (selectedListId == null) {
        listDisplayContainer.style.display="none"
    }
    else{
        listDisplayContainer.style.display=""
        listTitleElement.innerText=selectedList.name
        renderTaskCount(selectedList)
        clearElement(taskContainer)
        renderTasks(selectedList)
    }

    
}

function renderTasks(selectedList){
    selectedList.tasks.forEach(task=>{
        // get all elements in the template tag, no need to recreate in js 
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        // console.log(checkbox.checked )
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        // input text 
        label.append(task.name)
        taskContainer.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList){
    const incompleteTasks = selectedList.tasks.filter(task=>!task.complete)
    let incompleteTasksCount=incompleteTasks.length
    const taskString=incompleteTasksCount ===1? "task":"tasks"
    listCountElement.innerText=`${incompleteTasksCount} ${taskString} remaining`
}

function renderLists(){
    lists.forEach(list => {
        // create li element 
        const listElement = document.createElement("li");
        // give each list element an id 
        listElement.dataset.listId=list.id
        // add class to list 
        listElement.classList.add("list-name");
        // set text of the list element aka name of list of tasks
        listElement.innerText = list.name;
        // only bold the list item that was last clicked 
        if(list.id===selectedListId){
            listElement.classList.add("active-list")
            // console.log("listId equals selectedListId")
            // console.log(list.id)
        }
        // console.log(`selectedListId=${selectedListId}`) 
        // console.log(`listId=${list.id}`) 

        // append li element to list container aka ul 
        listsContainer.appendChild(listElement);


    });
}

function saveAndRender(){
    save()
    render()
}



function clearElement(element){
    // list.pop;
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}


render();
