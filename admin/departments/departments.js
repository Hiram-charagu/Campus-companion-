let departments = [
    { id: 1, name: "Computer Science", code: "CS", head: "Dr. John Doe", courses: 6, lecturers: 18, icon: "💻" },
    { id: 2, name: "Information Technology", code: "IT", head: "Dr. Mary Wambui", courses: 5, lecturers: 14, icon: "🌐" },
    { id: 3, name: "Nursing", code: "NUR", head: "Dr. Faith Njeri", courses: 4, lecturers: 21, icon: "🩺" },
    { id: 4, name: "Business", code: "BUS", head: "Prof. David Mutiso", courses: 5, lecturers: 17, icon: "📈" },
    { id: 5, name: "Education", code: "EDU", head: "Dr. Grace Achieng", courses: 4, lecturers: 12, icon: "🧠" },
    { id: 6, name: "Applied Sciences", code: "APS", head: "Dr. Peter Kariuki", courses: 3, lecturers: 10, icon: "🧪" }
];
let editingDepartmentId = null;

function renderDepartments() {
    const grid = document.getElementById("department-grid");
    grid.innerHTML = departments.map((department) => `<article class="department-card"><div class="department-icon">${department.icon}</div><h3>${department.name}</h3><p class="department-code">${department.code}</p><div class="department-meta"><span><strong>Head:</strong> ${department.head}</span><span>${department.courses} courses · ${department.lecturers} lecturers</span></div><div class="department-actions"><button class="btn btn-secondary btn-small" data-action="edit" data-id="${department.id}">Edit</button><button class="btn btn-danger btn-small" data-action="delete" data-id="${department.id}">Delete</button></div></article>`).join("");
    grid.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => manageDepartment(button.dataset.action, Number(button.dataset.id))));
}

function manageDepartment(action, id) {
    const department = departments.find((item) => item.id === id);
    if (action === "edit") { openModal(department); return; }
    departments = departments.filter((item) => item.id !== id);
    renderDepartments(); showToast("Department removed from this preview.");
}

function openModal(department) {
    editingDepartmentId = department?.id || null;
    document.getElementById("department-modal-title").textContent = department ? "Edit department" : "Add department";
    document.getElementById("department-name").value = department?.name || "";
    document.getElementById("department-code").value = department?.code || "";
    document.getElementById("department-head").value = department?.head || "";
    document.getElementById("department-modal").classList.add("active");
}

function closeModal() { document.getElementById("department-modal").classList.remove("active"); }
function saveDepartment() {
    const name = document.getElementById("department-name").value.trim();
    const code = document.getElementById("department-code").value.trim().toUpperCase();
    const head = document.getElementById("department-head").value.trim();
    if (!name || !code || !head) { showToast("Complete all department fields."); return; }
    const entry = { name, code, head };
    if (editingDepartmentId) { Object.assign(departments.find((item) => item.id === editingDepartmentId), entry); showToast("Department updated."); } else { departments.push({ id: Date.now(), ...entry, courses: 0, lecturers: 0, icon: "🏛️" }); showToast("Department created."); }
    closeModal(); renderDepartments();
}
function showToast(message) { const toast = document.getElementById("toast"); toast.textContent = message; toast.classList.add("show"); window.setTimeout(() => toast.classList.remove("show"), 2800); }
document.addEventListener("DOMContentLoaded", () => { renderDepartments(); document.getElementById("open-department-modal").addEventListener("click", () => openModal()); document.getElementById("close-department-modal").addEventListener("click", closeModal); document.getElementById("save-department").addEventListener("click", saveDepartment); document.getElementById("department-modal").addEventListener("click", (event) => { if (event.target.id === "department-modal") closeModal(); }); });
