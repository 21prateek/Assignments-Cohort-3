//  start from here
let isSigningUp = false;
let isAddingTodo = false;

//In sign-up submission
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault(); //it will stop our page to reload

  //if it is true it means already signed up
  if (isSigningUp) return;

  //if not here we will make it true and then signup
  isSigningUp = true;

  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  try {
    const response = await fetch("http://localhost:3000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    //get the response
    const result = await response.json();

    //make the sign up false again
    isSigningUp = false;

    if (response.ok) {
      document.getElementById("response-message").innerText =
        result.message || "Signup successful,please sign in";
      //now hide the signup form and bring in the signin form
      document.getElementById("signup-container").style.display = "none";
      document.getElementById("signin-container").style.display = "block";
    } else {
      document.getElementById("response-message").innerText =
        result.message || "Signup failed";
    }
  } catch (e) {
    isSigningUp = false;
    document.getElementById("response-message").innerText =
      "Error during signup";
  }
});

//Signin form
document.getElementById("signin-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signin-username").value;
  const password = document.getElementById("signin-password").value;

  try {
    const response = await fetch("http://localhost:3000/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    console.log(result.token);
    if (response.ok) {
      localStorage.setItem("token", result.token);
      document.getElementById("signin-container").style.display = "none";
      document.getElementById("todo-container").style.display = "block";

      //make a logout button
      document.getElementById(
        "response-message"
      ).innerHTML = `Logged in successfully. <a href="#" id="logout-link">Logout</a>`;

      loadTodos();

      // Add event listener for the logout link
      document.getElementById("logout-link").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token"); // Clear token
        document.getElementById("todo-container").style.display = "none";
        document.getElementById("signin-container").style.display = "block";
        document.getElementById("response-message").innerText = "";
      });
    } else {
      document.getElementById("response-message").innerText =
        result.message || "Signin failed";
    }
  } catch (error) {
    document.getElementById("response-message").innerText =
      "Error during signin";
  }
});

//Adding todo on form submission
document.getElementById("todo-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Prevent multiple submissions
  if (isAddingTodo) return;
  isAddingTodo = true;

  const todoInput = document.getElementById("todo-input");
  const todoText = todoInput.value.trim();

  if (!todoText) {
    alert("Please enter a valid todo!");
    isAddingTodo = false;
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to add a todo!");
    isAddingTodo = false;
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure Bearer prefix is included
      },
      body: JSON.stringify({ title: todoText, done: false }),
    });

    const result = await response.json();

    if (response.ok) {
      todoInput.value = ""; // Clear input field
      loadTodos(); // Reload todos
      alert("Todo added successfully!");
    } else {
      if (result.message === "Invalid or expired token") {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token"); // Clear invalid token
        window.location.href = "/login.html"; // Redirect to login page
      } else {
        alert(`Error adding todo: ${result.message || "Unknown error"}`);
      }
    }
  } catch (error) {
    console.error("Error adding todo:", error);
    alert("Failed to add todo. Please try again.");
  } finally {
    isAddingTodo = false; // Reset the flag
  }
});

//Loading todo
async function loadTodos() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/todo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { todos } = await response.json();
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.textContent = todo.title;

      if (todo.done) {
        li.style.textDecoration = "line-through";
      }

      //create a button
      const completeButton = docuemt.createElement("button");
      //put it text content as complete
      completeButton.textContent = "Complete";
      //make an onclick handler
      completeButton.onclick = () => {
        completeTodo(todo._id, !todo.done);
      };

      if (!todo.done) {
        li.appendChild(completeButton); // Only add button if not completed
      }

      todoList.appendChild(li);
    });
  } catch (e) {
    console.error("Error loading todos:", error);
  }
}

// Complete Todo
async function completeTodo(id, done) {
  const token = localStorage.getItem("token");
  try {
    await fetch(`http://localhost:3000/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ done }),
    });
    loadTodos();
  } catch (error) {
    console.error("Error completing todo:", error);
  }
}

// Toggle between Signup and Signin
document.getElementById("show-signin").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("signup-container").style.display = "none";
  document.getElementById("signin-container").style.display = "block";
});

document.getElementById("show-signup").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("signin-container").style.display = "none";
  document.getElementById("signup-container").style.display = "block";
});
