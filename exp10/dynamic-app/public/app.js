document.getElementById("f").addEventListener("submit", async function (e) {
  e.preventDefault();
  var out = document.getElementById("out");
  try {
    var res = await fetch("/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.value, text: text.value })
    });
    var data = await res.json();
    out.textContent = data.message;
    if (res.ok) e.target.reset();
  } catch (err) {
    out.textContent = "Could not contact the server.";
  }
});
