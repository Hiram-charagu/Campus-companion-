const ADMIN_PROFILE_KEY = "admin_profile";
const ADMIN_SETTINGS_KEY = "admin_settings";
const ADMIN_NOTIFICATIONS_KEY = "admin_notifications";

const defaultAdminProfile = {
    firstName: "Amina",
    lastName: "Wanjiru",
    email: "amina.wanjiru@university.ac.ke",
    phone: "+254 711 000 000",
    department: "Administration",
    bio: "System administrator responsible for academic operations and campus records.",
    photo: null
};

const defaultAdminNotifications = [
    { id: 1, icon: "👥", color: "teal", title: "New lecturer registration", message: "A new lecturer account is waiting for approval.", time: "8 mins ago", unread: true },
    { id: 2, icon: "📚", color: "blue", title: "Course update submitted", message: "Computer Science has submitted a new unit for review.", time: "2 hours ago", unread: true },
    { id: 3, icon: "📢", color: "amber", title: "Announcement published", message: "Your campus-wide registration reminder is now live.", time: "Yesterday", unread: true },
    { id: 4, icon: "✅", color: "green", title: "User approvals complete", message: "All pending student registrations were reviewed.", time: "2 days ago", unread: false }
];

function readAdminStorage(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

function getAdminProfile() {
    return { ...defaultAdminProfile, ...readAdminStorage(ADMIN_PROFILE_KEY, {}) };
}

function getInitials(profile) {
    return `${profile.firstName?.[0] || "A"}${profile.lastName?.[0] || "W"}`.toUpperCase();
}

function renderAvatar(element, profile) {
    if (!element) return;
    if (!profile.photo) {
        element.textContent = getInitials(profile);
        return;
    }
    const image = document.createElement("img");
    image.src = profile.photo;
    image.alt = "Admin profile photo";
    element.replaceChildren(image);
}

function hydrateAdminProfile() {
    const profile = getAdminProfile();
    const name = `${profile.firstName} ${profile.lastName}`;
    const sidebarName = document.getElementById("sidebar-name");
    const sidebarDepartment = document.getElementById("sidebar-department");
    if (sidebarName) sidebarName.textContent = name;
    if (sidebarDepartment) sidebarDepartment.textContent = profile.department;
    renderAvatar(document.getElementById("sidebar-avatar"), profile);
    renderAvatar(document.getElementById("topbar-avatar"), profile);
}

function getAdminNotifications() {
    return readAdminStorage(ADMIN_NOTIFICATIONS_KEY, defaultAdminNotifications);
}

function saveAdminNotifications(notifications) {
    localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function syncNotificationBadges() {
    const unread = getAdminNotifications().filter((notification) => notification.unread).length;
    document.querySelectorAll(".notification-badge").forEach((badge) => {
        badge.textContent = unread;
        badge.classList.toggle("is-hidden", unread === 0);
    });
}

function applyAdminPreferences() {
    const settings = readAdminStorage(ADMIN_SETTINGS_KEY, {});
    document.body.classList.toggle("dark", Boolean(settings.darkMode));
    document.querySelector(".sidebar")?.classList.toggle("compact", Boolean(settings.compactSidebar));
}

window.CampusAdmin = {
    getAdminProfile,
    hydrateAdminProfile,
    getAdminNotifications,
    saveAdminNotifications,
    syncNotificationBadges,
    applyAdminPreferences
};

document.addEventListener("DOMContentLoaded", () => {
    hydrateAdminProfile();
    applyAdminPreferences();
    syncNotificationBadges();
});
