import { useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  function saveNote() {
    if (text.trim() === "") { alert("Please write something"); return; }
    if (editId === null) {
      setNotes([...notes, { id: Date.now(), text: text.trim() }]);
    } else {
      setNotes(notes.map(n => (n.id === editId ? { ...n, text: text.trim() } : n)));
      setEditId(null);
    }
    setText("");
  }
  function editNote(n) { setText(n.text); setEditId(n.id); }
  function deleteNote(id) { setNotes(notes.filter(n => n.id !== id)); }

  return (
    <div className="app">
      <h1>Avni's Notes</h1>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write a note..." />
      <br />
      <button onClick={saveNote}>{editId === null ? "Add Note" : "Update Note"}</button>
      <p className="total">Total notes: {notes.length}</p>
      {notes.map(n => (
        <div className="note" key={n.id}>
          <p>{n.text}</p>
          <button onClick={() => editNote(n)}>Edit</button>
          <button className="del" onClick={() => deleteNote(n.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
export default App;
