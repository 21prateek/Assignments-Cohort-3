let todos = []; // in memory space

//get all todos
async function getAllTodo(req, res, next) {
  //  write here
  try {
    res.json({ success: true, todos });
  } catch (e) {
    next(e);
  }
}

//creating todo
async function createTodo(req, res, next) {
  //  write here
  try {
    const { title } = req.body;

    if (!title || typeof title != "string") {
      return res.status(400).json({
        success: false,
        message: "Title is required and must be a string.",
      });
    }

    const newTodo = {
      id: todos.length + 1,
      title: title,
      completed: false,
    };

    todos.push(newTodo);

    res.json({
      success: true,
      message: "Todo has been added",
      todos,
    });
  } catch (e) {
    next(e);
  }
}

//update todos
async function updateTodo(req, res, next) {
  //  write here
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    // Find the todo by ID
    const todo = todos.find((todo) => todo.id === parseInt(id));

    if (!todo) {
      return res.json({ message: "No todo found" });
    }

    //if the updated title is not undefined then we need put todo.title as title otherwise the put the old todo only
    todo.title = title !== undefined ? title : todo.title;
    todo.completed = completed !== undefined ? completed : todo.completed;

    res.json({
      success: true,
      data: todo,
    });
  } catch (e) {
    next(e);
  }
}

async function deleteTodo(req, res, next) {
  //  write here
  try {
    todos = [];
    res.json({
      success: true,
      todos,
      message: "Deleted all todos",
    });
  } catch (e) {
    next(e);
  }
}

async function deleteTodoById(req, res, next) {
  //  write here
  try {
    const { id } = req.params; // Extract ID from URL parameters

    // Find the index of the todo by ID
    const index = todos.findIndex((todo) => todo.id === parseInt(id));

    if (index === -1) {
      // If no todo is found, respond with a 404 error
      return res
        .status(404)
        .json({ success: false, message: "No todo found with the given ID." });
    }

    // Remove the todo from the array
    const deletedTodo = todos.splice(index, 1)[0];

    // Respond with the deleted todo
    res.status(200).json({ success: true, data: deletedTodo });
  } catch (error) {
    // Handle any potential errors
    next(error);
  }

  //   We can also use filter but in that we will be creating a new array
  /*try {
    const { id } = req.params; // Extract ID from URL parameters

    // Find the todo to delete
    const todoToDelete = todos.find((todo) => todo.id === parseInt(id));

    if (!todoToDelete) {
      // If no todo is found, respond with a 404 error
      return res.status(404).json({ success: false, message: "No todo found with the given ID." });
    }

    // Filter out the todo with the given ID
    todos = todos.filter((todo) => todo.id !== parseInt(id));

    // Respond with the deleted todo
    res.status(200).json({ success: true, data: todoToDelete });
  } catch (error) {
    // Handle any potential errors
    next(error);
  } */
}

/*
implementation of deletedTodoById
let todos = [
  { id: 1, title: "First Todo", description: "Do something", completed: false },
  { id: 2, title: "Second Todo", description: "Do something else", completed: false },
  { id: 3, title: "Third Todo", description: "Another task", completed: true },
];

{ id: "2" } // ID to delete
 Extract ID from Parameters:

const { id } = req.params;
id becomes "2" (a string). It will be used in further operations.

Find the Index of the Todo:
const index = todos.findIndex((todo) => todo.id === parseInt(id));
parseInt(id) converts the "2" string to the number 2.

todos.findIndex iterates through the array:
For the first object (id: 1): 1 !== 2, so continue.
For the second object (id: 2): 2 === 2, so the index is 1.
index = 1.

Check if the Todo Exists:
if (index === -1) { ... }
Since index = 1, the condition is false, so the code proceeds.

Remove the Todo:
const deletedTodo = todos.splice(index, 1)[0];
index = 1 from above
todos.splice(1, 1) removes the element at index 1 ({ id: 2, ... }).
splice returns an array of the removed items: [ { id: 2, title: "Second Todo", ... } ].
[0] accesses the first element of this array, assigning it to deletedTodo
deletedTodo = { id: 2, title: "Second Todo", description: "Do something else", completed: false };
*/

module.exports = {
  createTodo,
  deleteTodo,
  deleteTodoById,
  updateTodo,
  getAllTodo,
};
