const data = JSON.parse(
  localStorage.campusData ||
    '{"classes":[["Human-centred Design","10:00","Creative Studio 2"],["Research Methods","13:00","North Building"]],"tasks":["Service design case study","Reading: inclusive research"]}',
);
const save = () => (localStorage.campusData = JSON.stringify(data));
let page = "Home";
document.body.innerHTML = `<style>*{box-sizing:border-box}body{margin:0;font:14px system-ui;background:#f3f5ef;color:#19352c}.app{display:grid;grid-template-columns:230px 1fr;min-height:100vh}.side{padding:30px 18px;background:#173b2e;color:white}.logo{font-size:22px;font-weight:900;color:#dbfa65}.side button{display:block;width:100%;border:0;background:none;text-align:left;padding:13px;color:#c9dad2;border-radius:8px}.side button:hover,.side button.on{background:#315b4c;color:white}.main{padding:38px;max-width:1100px;width:100%;margin:auto}.top{display:flex;justify-content:space-between;align-items:center}.top button,.primary{border:0;background:#1d604d;color:#fff;border-radius:8px;padding:10px 14px;font-weight:700}.grid{display:grid;grid-template-columns:1.3fr .7fr;gap:20px}.card{background:white;border:1px solid #e0e5de;border-radius:14px;padding:22px;margin-top:20px}.row{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #edf0ec;align-items:center}.row b{min-width:55px}.row div{flex:1}.row small{display:block;color:#708078;margin-top:4px}.row button{border:0;background:#f3f5ef;border-radius:6px;padding:7px}.empty{padding:45px;text-align:center;color:#708078}.modal{position:fixed;inset:0;background:#0006;display:grid;place-items:center}.modal form{background:white;padding:25px;border-radius:14px;width:min(420px,90vw)}input,select{width:100%;padding:11px;margin:6px 0 15px;border:1px solid #ccd7d0;border-radius:7px}@media(max-width:700px){.app{grid-template-columns:1fr}.side{display:flex;overflow:auto;padding:10px}.side button{width:auto;white-space:nowrap}.grid{grid-template-columns:1fr}.main{padding:20px}}</style><div class="app"><aside class="side"><div class="logo">CAMPUSFLOW</div>${["Home", "Schedule", "Tasks", "Map"].map((x) => `<button class="${x === page ? "on" : ""}" onclick="go('${x}')">${x}</button>`).join("")}</aside><main class="main"><div class="top"><div><small>STUDENT WORKSPACE</small><h1 id="title">${page}</h1></div><button onclick="openAdd()">+ Add ${page === "Tasks" ? "task" : "class"}</button></div><section id="view"></section></main></div><div id="modal"></div>`;
function go(x) {
  page = x;
  document
    .querySelectorAll(".side button")
    .forEach((b) => b.classList.toggle("on", b.textContent === x));
  document.querySelector("#title").textContent = x;
  render();
}
function rows(items, type) {
  return items.length
    ? items
        .map(
          (a, i) =>
            `<div class="row"><b>${type === "class" ? a[1] : "TASK"}</b><div><strong contenteditable oninput="edit(${i},this.innerText,'${type}')">${type === "class" ? a[0] : a}</strong><small>${type === "class" ? a[2] : "Due this week · click text to edit"}</small></div><button onclick="removeItem(${i},'${type}')">Delete</button></div>`,
        )
        .join("")
    : '<div class="empty">Nothing here yet. Add your first item.</div>';
}
function render() {
  const v = document.querySelector("#view");
  if (page === "Home")
    v.innerHTML = `<div class="grid"><div class="card"><h2>Today’s schedule</h2>${rows(data.classes, "class")}</div><div class="card"><h2>Quick status</h2><p>2 classes · ${data.tasks.length} tasks</p><button class="primary" onclick="go('Tasks')">Review tasks →</button></div></div>`;
  if (page === "Schedule")
    v.innerHTML = `<div class="card"><h2>Editable timetable</h2>${rows(data.classes, "class")}</div>`;
  if (page === "Tasks")
    v.innerHTML = `<div class="card"><h2>Deadline board</h2>${rows(data.tasks, "task")}</div>`;
  if (page === "Map")
    v.innerHTML = `<div class="card"><h2>Campus map</h2><input placeholder="Search a building" oninput="document.querySelector('#mapresult').textContent=this.value?'Showing route to '+this.value:'Choose a building'"/><div id="mapresult" class="empty">Choose a building</div></div>`;
}
function openAdd() {
  modal.innerHTML = `<div class="modal"><form onsubmit="add(event)"><h2>Add ${page === "Tasks" ? "task" : "class"}</h2><input name="name" placeholder="Name" required>${page === "Tasks" ? "" : '<input name="time" type="time" required><input name="place" placeholder="Location" required>'}<button class="primary">Save</button> <button type="button" onclick="modal.innerHTML=''">Cancel</button></form></div>`;
}
function add(e) {
  e.preventDefault();
  const f = e.target;
  if (page === "Tasks") data.tasks.push(f.name.value);
  else data.classes.push([f.name.value, f.time.value, f.place.value]);
  save();
  modal.innerHTML = "";
  render();
}
function edit(i, v, t) {
  if (t === "class") data.classes[i][0] = v;
  else data.tasks[i] = v;
  save();
}
function removeItem(i, t) {
  data[t === "class" ? "classes" : "tasks"].splice(i, 1);
  save();
  render();
}
render();
