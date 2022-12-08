// variables
let todoItems = []
const todoInput = document.querySelector(".todo-input")
const completedTodosDiv = document.querySelector(".completed-todos")
const uncompletedTodosDiv = document.querySelector(".uncompleted-todos")
const audio = new Audio("sound.wav")
const successAudio = new Audio("success.mp3")

// get todo list on first boot
window.onload = () => {
  let storageTodoItems = localStorage.getItem("todoItems")

  if (storageTodoItems !== null) todoItems = JSON.parse(storageTodoItems)

  render()
}

// get the content typed into the input
todoInput.onkeyup = (e) => {
  let value = e.target.value.replace(/^\s+/, "")
  if (value && e.keyCode === 13) {
    addTodo(value)

    todoInput.value = ""
    todoInput.focus()
  }
}

// add todo
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false,
  })

  saveAndRender()
}

// remove todo
function removeTodo(id) {
  todoItems = todoItems.filter((item) => item.id !== Number(id))
  audio.play()
  saveAndRender()
}

// mark as completed
function markAsCompleted(id) {
  todoItems = todoItems.filter((item) => {
    if (item.id === Number(id)) {
      item.completed = true
    }
    return item
  })
  successAudio.play()
  saveAndRender()
}

// mark as uncompleted
function markAsUncompleted(id) {
  todoItems = todoItems.filter((item) => {
    if (item.id === Number(id)) {
      item.completed = false
    }
    return item
  })

  saveAndRender()
}

// save in localstorage
function save() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems))
}

// render
function render() {
  let uncompletedTodos = todoItems.filter((item) => !item.completed)
  let completedTodos = todoItems.filter((item) => item.completed)

  completedTodosDiv.innerHTML = ""
  uncompletedTodosDiv.innerHTML = ""

  if (uncompletedTodos.length > 0) {
    uncompletedTodos.forEach((todo) => uncompletedTodosDiv.append(createTodoElement(todo)))
  } else {
    uncompletedTodosDiv.innerHTML = `<div class="empty">No uncompleted missions.</div>`
  }

  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class="completed-title">Completed (${completedTodos.length}/${todoItems.length})</div>`
    completedTodos.forEach((todo) => completedTodosDiv.append(createTodoElement(todo)))
  }
}

// save and render
function saveAndRender() {
  save()
  render()
}

// create todo list item
function createTodoElement(todo) {
  // create todo list container
  const todoDiv = document.createElement("div")
  todoDiv.setAttribute("data-id", todo.id)
  todoDiv.className = "todo-item"

  // create todo item text
  const todoText = document.createElement("span")
  todoText.innerHTML = todo.text

  // checkbox for items
  const todoCheckbox = document.createElement("input")
  todoCheckbox.type = "checkbox"
  todoCheckbox.checked = todo.completed
  todoCheckbox.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id
    e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
  }

  // delete button for items
  const deleteButton = document.createElement("a")
  deleteButton.href = "#"
  deleteButton.innerHTML = `<svg
  xmlns="http://www.w3.org/2000/svg"
  class="icon icon-tabler icon-tabler-x"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`
  deleteButton.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id
    removeTodo(id)
  }

  todoText.prepend(todoCheckbox)
  todoDiv.appendChild(todoText)
  todoDiv.appendChild(deleteButton)

  return todoDiv
}
