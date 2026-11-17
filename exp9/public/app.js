function show(el, text, err) { el.textContent = text; el.classList.toggle("error", !!err); }

async function post(url, body) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  const msg = document.getElementById("rMsg");
  try {
    const d = await post("/register", { email: rEmail.value, password: rPass.value });
    show(msg, d.message); e.target.reset();
  } catch (err) { show(msg, err.message, true); }
});

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const msg = document.getElementById("lMsg");
  try {
    const d = await post("/login", { email: lEmail.value, password: lPass.value });
    sessionStorage.setItem("token", d.token);
    e.target.reset();
    loadProfile();
  } catch (err) { show(msg, err.message, true); }
});

async function loadProfile() {
  const token = sessionStorage.getItem("token");
  if (!token) return;
  const res = await fetch("/profile", { headers: { Authorization: "Bearer " + token } });
  const data = await res.json();
  if (!res.ok) { sessionStorage.removeItem("token"); return; }
  who.textContent = "Logged in as: " + data.email;
  authBox.classList.add("hidden");
  profile.classList.remove("hidden");
}

document.getElementById("logout").addEventListener("click", () => {
  sessionStorage.removeItem("token");
  profile.classList.add("hidden");
  authBox.classList.remove("hidden");
});

loadProfile();
