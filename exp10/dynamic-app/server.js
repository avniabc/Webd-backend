const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let suggestions = [];

app.get("/health", (req, res) => res.json({ status: "OK", owner: "Avni Gupta" }));

app.post("/suggest", (req, res) => {
  const name = String(req.body.name || "").trim();
  const text = String(req.body.text || "").trim();
  if (!name || !text) return res.status(400).json({ message: "Name and suggestion required." });
  const item = { id: suggestions.length + 1, name, text };
  suggestions.push(item);
  res.json({ message: "Thanks " + name + "! Suggestion saved.", item });
});

app.get("/suggest", (req, res) => res.json(suggestions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log("Running on port " + PORT));
