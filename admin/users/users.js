let users = [
    { id: 1, name: "Dr. John Doe", email: "john.doe@university.ac.ke", role: "Lecturer", department: "Computer Science", status: "Approved" },
    { id: 2, name: "Mary Wambui", email: "mary.wambui@student.ac.ke", role: "Student", department: "Information Technology", status: "Pending" },
    { id: 3, name: "David Mutiso", email: "david.mutiso@university.ac.ke", role: "Lecturer", department: "Business", status: "Suspended" },
    { id: 4, name: "Grace Achieng", email: "grace.achieng@student.ac.ke", role: "Student", department: "Nursing", status: "Approved" },
    { id: 5, name: "Peter Kariuki", email: "peter.kariuki@university.ac.ke", role: "Admin", department: "Administration", status: "Approved" }
];
let editingUserId = null;

function initials(name) { return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(); }
function roleClass(role) { return role.toLowerCase(); }
function statusClass(status) { return status.toLowerCase(); }

function filteredUsers() {
    const search = document.getElementById("user-search").value.toLowerCase();
    const role = document.getElementById("role-filter").value;
    const status = document.getElementById("status-filter").value;
    return users.filter((user) => (user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)) && (role === "all" || user.role === role) && (status === "all" || user.status === status));
}

function renderUsers() {
    const body = document.getElementById("users-body");
    const data = filteredUsers();
    if (!data.length) { body.innerHTML = '<tr class="empty-row"><td colspan="5">No users match your filters.</td></tr>'; return; }
    body.innerHTML = data.map((user) => `<tr><td><div class="table-user"><span class="table-avatar">${initials(user.name)}</span><div><strong>${user.name}</strong><span>${user.email}</span></div></div></td><td><span class="badge badge-${roleClass(user.role)}">${user.role}</span></td><td>${user.department}</td><td><span class="badge badge-${statusClass(user.status)}">${user.status}</span></td><td><div class="actions"><button class="btn btn-secondary btn-small" data-action="edit" data-id="${user.id}">Edit</button><button class="btn btn-secondary btn-small status-action" data-action="status" data-id="${user.id}">${user.status === "Pending" ? "Approve" : user.status === "Suspended" ? "Reactivate" : "Suspend"}</button><button class="btn btn-danger btn-small" data-action="delete" data-id="${user.id}">Delete</button></div></td></tr>`).join("");
    body.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => handleUserAction(button.dataset.action, Number(button.dataset.id))));
}

function handleUserAction(action, id) {
    const user = users.find((item) => item.id === id);
    if (!user) return;
    if (action === "edit") { openUserModal(user); return; }
    if (action === "delete") { users = users.filter((item) => item.id !== id); showToast("User removed from this portal preview."); renderUsers(); return; }
    user.status = user.status === "Pending" ? "Approved" : user.status === "Suspended" ? "Approved" : "Suspended";
    showToast(`Account ${user.status.toLowerCase()}.`);
    renderUsers();
}

function openUserModal(user) {
    editingUserId = user?.id || null;
    document.getElementById("user-modal-title").textContent = user ? "Edit user" : "Add user";
    document.getElementById("user-name").value = user?.name || "";
    document.getElementById("user-email").value = user?.email || "";
    document.getElementById("user-role").value = user?.role || "Student";
    document.getElementById("user-department").value = user?.department || "Computer Science";
    document.getElementById("user-modal").classList.add("active");
}

function closeUserModal() { document.getElementById("user-modal").classList.remove("active"); }

function saveUser() {
    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();
    if (!name || !email) { showToast("Enter a name and email address."); return; }
    const user = { name, email, role: document.getElementById("user-role").value, department: document.getElementById("user-department").value };
    if (editingUserId) { Object.assign(users.find((item) => item.id === editingUserId), user); showToast("User details updated."); } else { users.unshift({ id: Date.now(), ...user, status: "Pending" }); showToast("New user added for approval."); }
    closeUserModal(); renderUsers();
}

function showToast(message) { const toast = document.getElementById("toast"); toast.textContent = message; toast.classList.add("show"); window.setTimeout(() => toast.classList.remove("show"), 2800); }

document.addEventListener("DOMContentLoaded", () => {
    renderUsers();
    document.getElementById("user-search").addEventListener("input", renderUsers);
    document.getElementById("role-filter").addEventListener("change", renderUsers);
    document.getElementById("status-filter").addEventListener("change", renderUsers);
    document.getElementById("open-user-modal").addEventListener("click", () => openUserModal());
    document.getElementById("close-user-modal").addEventListener("click", closeUserModal);
    document.getElementById("save-user").addEventListener("click", saveUser);
    document.getElementById("user-modal").addEventListener("click", (event) => { if (event.target.id === "user-modal") closeUserModal(); });
});
