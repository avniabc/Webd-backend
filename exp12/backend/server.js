require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err.message));

const Task = mongoose.model("Task", new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false }
}));

app.get("/", (req, res) => res.send("Avni's MERN Task API is running"));

app.get("/tasks", async (req, res) => res.json(await Task.find()));

app.post("/tasks", async (req, res) => {
  if (!req.body.title) return res.status(400).json({ message: "title required" });
  const task = await new Task({ title: req.body.title }).save();
  res.status(201).json(task);
});

app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "not found" });
  task.done = !task.done;
  await task.save();
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

app.listen(process.env.PORT || 5000, () => console.log("Backend running"));
