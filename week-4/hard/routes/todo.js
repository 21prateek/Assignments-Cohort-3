const { Router } = require("express");
const adminMiddleware = require("../middleware/user");
const todoRouter = Router();
const { Todo } = require("../database/index");
const userMiddleware = require("../middleware/user");

// todo Routes
todoRouter.post("/", userMiddleware, async (req, res) => {
  // Implement todo creation logic
  const { title, done } = req.body;

  if (!title) {
    return res.json({
      message: "Enter a todo title",
    });
  }

  try {
    await Todo.create({
      userId: req.userId,
      title,
      done: done || false,
    });

    res.json({
      message: "Todo has been added",
    });
  } catch (e) {
    return res.json({
      message: "Error found",
      e,
    });
  }
});

todoRouter.put("/:id", userMiddleware, async (req, res) => {
  // Implement update todo  logic
  const { id } = req.params;
  const { title, done } = req.body;

  try {
    // Step 1: Find the todo by ID
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Step 2: Check if the todo belongs to the user
    if (todo.userId.toString() != req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this todo" });
    }

    // Step 3: Update the todo
    todo.title = title !== undefined ? title : todo.title;
    todo.done = done !== undefined ? done : todo.done;
    await todo.save();

    return res.json({ message: "Todo updated", todo });
  } catch (err) {
    return res.status(500).json({ message: "Error updating todo", error: err });
  }
});

todoRouter.delete("/:id", userMiddleware, async (req, res) => {
  // Implement delete todo by id logic
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.userId, // Ensure the todo belongs to the authenticated user
    });

    console.log(todo);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.json({ message: "Todo deleted", todo });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting todo", error: err });
  }
});

todoRouter.get("/", userMiddleware, async (req, res) => {
  // Implement fetching all todo logic
  try {
    const todo = await Todo.find({
      userId: req.userId,
    });

    return res.json({
      todo,
    });
  } catch (e) {
    return res.json({
      message: "Error in fetching todo",
      e,
    });
  }
});

todoRouter.get("/:id", userMiddleware, async (req, res) => {
  // Implement fetching todo by id logic
  const { id } = req.params;

  try {
    const todo = await Todo.findOne({ _id: id, userId: req.userId });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    return res.json({ todo });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching todo", error: err });
  }
});

module.exports = {
  todoRouter,
};
