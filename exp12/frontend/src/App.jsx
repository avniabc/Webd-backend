import { useEffect, useState } from "react";

// After deploying the backend, put its URL here (e.g. https://avni-api.onrender.com)
const API_URL = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  async function loadTasks() {
    const res = await fetch(API_URL + "/tasks");
    setTasks(await res.json());
  }
  async function addTask() {
    if (title.trim() === "") return;
    await fetch(API_URL + "/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() })
    });
    setTitle("");
    loadTasks();
  }
  async function toggleTask(id) {
    await fetch(API_URL + "/tasks/" + id, { method: "PUT" });
    loadTasks();
  }
  async function deleteTask(id) {
    await fetch(API_URL + "/tasks/" + id, { method: "DELETE" });
    loadTasks();
  }
  useEffect(() => { loadTasks(); }, []);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial", marginTop: 40 }}>
      <h1>Avni's MERN Task Manager</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a task" />
      <button onClick={addTask}>Add</button>
      {tasks.map(t => (
        <p key={t._id}>
          <span onClick={() => toggleTask(t._id)}
                style={{ cursor: "pointer", textDecoration: t.done ? "line-through" : "none" }}>
            {t.title}
          </span>{" "}
          <button onClick={() => deleteTask(t._id)}>Delete</button>
        </p>
      ))}
    </div>
  );
}
export default App;
