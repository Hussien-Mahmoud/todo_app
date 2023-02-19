/*
    KEY COMPONENTS:
    "activeItem" = null until an edit button is clicked. Will contain object of item we are editing
    "list_snapshot" = Will contain previous state of list. Used for removing extra rows on list update

    PROCESS:
    1 - Fetch Data and build rows "buildList()"
    2 - Create Item on form submit
    3 - Edit Item click - Prefill form and change submit URL
    4 - Delete Item - Send item id to delete URL
    5 - Cross out completed task - Event handle updated item
    NOTES:
    -- Add event handlers to "edit", "delete", "title"
    -- Render with strike through items completed
    -- Remove extra data on re-render
    -- CSRF Token
*/
const parser = new DOMParser();
buildList()

function reorderRowsIDS() {
    let tasks = document.getElementsByClassName('task')
    for (let i = 0; i < tasks.length ; i++) {
        tasks[i].id = `data-row-${i}`
    }
}


function addTask(task) {
    let wrapper = document.getElementById('list-wrapper')
    let item = `
        <div id="data-row-" class="task task-wrapper flex-wrapper">
            <div style="flex: 7">
                <span class="title">${task.title}</span>
            </div>
            <div style="flex: 1">
                <button class="btn btn-sm btn-outline-info edit">Edit</button>
            </div>
            <div style="flex: 1">
                <button class="btn btn-sm btn-outline-dark delete">-</button>
            </div>
        </div>
    `

    const doc = parser.parseFromString(item, "text/html");
    let itemNode = doc.querySelector("body>div")
    wrapper.insertBefore(itemNode, wrapper.firstChild);

    let editBtn = itemNode.getElementsByClassName('edit')[0]
    editBtn.addEventListener('click', function (event){
        editTask(task, itemNode)
    })

    let deleteBtn = itemNode.getElementsByClassName('delete')[0]
    deleteBtn.addEventListener('click', function (event){
        deleteTask(task, itemNode)
    })

    reorderRowsIDS()
}

function buildList() {
    let wrapper = document.getElementById('list-wrapper')
    wrapper.innerHTML = ''

    let url = '/api/task-list/'
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            let list = data
            for (let i in list.reverse()) {
                addTask(list[i])
            }
        })
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

let editNode = null

let activeItem = null
let title = document.getElementById('title')
let form = document.getElementById('form')

function reset() {
    title.value = ''
    activeItem = null

    let submitBtn = document.getElementById('submit')
    submitBtn.setAttribute('value', 'submit')

    let cancelBtn = document.getElementById('cancel')
    cancelBtn.parentElement.setAttribute('hidden', '')
}

form.addEventListener('submit', function (event) {
    event.preventDefault()
    console.log('form submitted')

    let url = '/api/task-create/'
    let method = 'POST'
    if (activeItem != null){
        url = `/api/task-update/${activeItem.id}/`
        method = 'PATCH'
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        mode: 'same-origin',
        body: JSON.stringify({'title': title.value})
    })

    .then((resp) => resp.json())
    .then(function (data) {
        if (activeItem != null){
            editNode.firstElementChild.firstElementChild.textContent = data.title
        } else {
            addTask(data)
        }
        reset()
        document.getElementById('form').reset()
    })
})

cancelBtn = document.getElementById('cancel')
cancelBtn.addEventListener('click', function (event) {
    console.log('cancel clicked')
    reset()
})

function editTask(task, node) {
    console.log('item clicked: ', task)
    title.focus()
    title.value = task.title

    let submitBtn = document.getElementById('submit')
    submitBtn.setAttribute('value', 'update')

    document.getElementById('cancel').parentElement
        .removeAttribute('hidden')

    activeItem = task
    editNode = node
}

function deleteTask(task, itemNode) {

    let url = `/api/task-delete/${task.id}/`
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        mode: 'same-origin',
    })

    .then((resp) => resp)
    .then(function (response) {

        if (response.status === 204){
            itemNode.remove()
        }
    })
}