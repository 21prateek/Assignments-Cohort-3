//  start writing your code from here
const { Router } = require("express");
const todoRouter = Router();

const { Todo } = require("../db/index");
const userMiddleware = require("../middleware/user");

todoRouter.post("/", userMiddleware, async (req, res) => {
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
      done,
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

//update
todoRouter.put("/:id", userMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.userId.toString() != req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this todo" });
    }

    todo.title = title !== undefined ? title : todo.title;
    todo.done = done !== undefined ? done : todo.done;
    await todo.save();

    return res.json({ message: "Todo updated", todo });
  } catch (err) {
    return res.status(500).json({ message: "Error updating todo", error: err });
  }
});

todoRouter.delete("/:id", userMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
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




//updating the todo done false and true
todoRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatePayload = req.body;

  // Basic input check
  if (typeof updatePayload.done === "undefined") {
    return res.status(400).json({
      msg: "You must provide a done status.",
    });
  }

  try {
    const result = await Todo.updateOne(
      { _id: id },
      { done: updatePayload.done }
    );

    res.json({
      result,
      msg: "Todo marked as completed.",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error updating todo.",
      error: error.message,
    });
  }
});

module.exports = {
  todoRouter,
};
