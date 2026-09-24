function setDashboardDate() {
    document.getElementById("today-date").textContent = new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function setGreeting() {
    const profile = window.CampusAdmin.getAdminProfile();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    document.getElementById("welcome-message").textContent = `${greeting}, ${profile.firstName}`;
}

function renderApprovals() {
    const approvals = [{ name: "Brian Otieno", role: "Lecturer", initials: "BO" }, { name: "Faith Njeri", role: "Student", initials: "FN" }, { name: "Daniel Kiptoo", role: "Lecturer", initials: "DK" }];
    document.getElementById("approval-list").innerHTML = approvals.map((user) => `<div class="approval-item"><span class="approval-avatar">${user.initials}</span><div><strong>${user.name}</strong><small>${user.role} registration awaiting approval</small></div><span class="badge badge-pending">Pending</span></div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => { setDashboardDate(); setGreeting(); renderApprovals(); });
