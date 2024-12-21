const API_URL = "http://localhost:3001/todos";

// Fetch existing todos when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // fetch todos
  fetchTodos();
});

// Fetch todos from backend
function fetchTodos() {
  //  write here

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Debug the response structure
      //check if there is any data.todos and if it is an array
      if (data.todos && Array.isArray(data.todos)) {
        const todos = data.todos;
        todos.forEach((todo) => addTodoToDOM(todo));
      } else {
        console.error("Unexpected response structure:", data);
      }
    })
    .catch((error) => console.error("Error fetching todos:", error));

  //fetch the todo from the url, then when the reponse come convert it in json format, then iterate on that todos and add it to the dom
}

// Add a new todo to the DOM
function addTodoToDOM(todo) {
  //  write here
  console.log("Adding todo to DOM:", todo); // Check the todo structure
  const todoList = document.getElementById("todo-list");

  const todoItem = document.createElement("li");
  todoItem.classList.add("todo-item");
  todoItem.setAttribute("data-id", todo.id);

  const title = document.createElement("span");
  title.textContent = todo.title;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));

  todoItem.appendChild(title);
  todoItem.appendChild(deleteButton);

  todoList.appendChild(todoItem);
}

// Add a new todo
document.getElementById("add-todo-btn").addEventListener("click", () => {
  const titleInput = document.getElementById("todo-input");
  const title = titleInput.value.trim(); // Get the value from the input

  if (!title) {
    console.error("Input not found");
    return;
  }

  const newTodo = { title: title };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Debug the API response structure
      if (data.todos && Array.isArray(data.todos)) {
        // Add the last added todo to the DOM
        //get the last todo
        const addedTodo = data.todos[data.todos.length - 1];
        //now send that todo and add it
        addTodoToDOM(addedTodo);
      } else {
        console.error("Unexpected response structure:", data);
      }
      titleInput.value = ""; // Clear the input field
    })
    .catch((error) => console.error("Error adding todo:", error));
});
// Delete a todo
function deleteTodo(id) {
  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      //get the li which has this query and then remove it
      const todoItem = document.querySelector(`[data-id='${id}']`);
      todoItem.remove();
    })
    .catch((error) => console.error("Error deleting todo:", error));
}

// Toggle todo completion
function toggleTodo(id, completed) {
  fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: !completed }),
  })
    .then((response) => response.json())
    .then((updatedTodo) => {
      const todoItem = document.querySelector(`[data-id='${id}']`);
      if (todoItem) {
        // Update the class or styling of the todo to reflect its completion
        if (updatedTodo.completed) {
          todoItem.classList.add("completed");
        } else {
          todoItem.classList.remove("completed");
        }
      }
    })
    .catch((error) => console.error("Error toggling todo:", error));
}
