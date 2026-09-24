const PROFILE_KEY = "lecturer_profile";

function getProfile() {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {
        firstName: "John", lastName: "Doe", department: "Computer Science", photo: null
    };
}

function setGreeting(name) {
    const hour = new Date().getHours();
    let greeting = "Good morning";
    if (hour >= 12 && hour < 17) greeting = "Good afternoon";
    else if (hour >= 17)          greeting = "Good evening";
    document.getElementById("welcome-msg").textContent = `${greeting}, Dr. ${name} 👋`;
}

function setDate() {
    const now = new Date();
    document.getElementById("topbar-date").textContent = now.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
}

function loadProfile() {
    const p = getProfile();
    const fullName = `${p.firstName} ${p.lastName}`;
    const initials = (p.firstName[0] + p.lastName[0]).toUpperCase();

    document.getElementById("sidebar-name").textContent = `Dr. ${fullName}`;
    document.getElementById("sidebar-dept").textContent = p.department;

    const sidebarAvatar = document.getElementById("sidebar-avatar");
    const topbarAvatar  = document.getElementById("topbar-avatar");

    if (p.photo) {
        sidebarAvatar.innerHTML = `<img src="${p.photo}" alt="avatar">`;
        topbarAvatar.innerHTML  = `<img src="${p.photo}" alt="avatar">`;
    } else {
        sidebarAvatar.textContent = initials;
        topbarAvatar.textContent  = initials;
    }

    setGreeting(fullName);
}

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    setDate();
});
