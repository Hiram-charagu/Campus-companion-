const CAMPUS_PROFILE_KEY = "lecturer_profile";
const CAMPUS_SETTINGS_KEY = "lecturer_settings";
const CAMPUS_NOTIFICATIONS_KEY = "lecturer_notifications";

const defaultProfile = {
    firstName: "John",
    lastName: "Doe",
    department: "Computer Science",
    photo: null
};

const defaultNotifications = [
    { id: 1, icon: "📢", color: "purple", title: "New Admin Announcement", message: "Registration deadline is 25th January 2025. Ensure all students are registered.", time: "2 mins ago", unread: true },
    { id: 2, icon: "🗓️", color: "green", title: "CAT Schedule Reminder", message: "CAT 1 for Data Structures is scheduled for 20th January. Prepare your students.", time: "1 hour ago", unread: true },
    { id: 3, icon: "🔔", color: "blue", title: "Material Upload Confirmed", message: "Your upload 'OS Week 3 Notes' was successfully saved and is visible to students.", time: "3 hours ago", unread: true },
    { id: 4, icon: "⚙️", color: "orange", title: "Profile Updated", message: "Your profile information was updated successfully.", time: "Yesterday", unread: false },
    { id: 5, icon: "🚫", color: "red", title: "Lecture Cancellation Posted", message: "Your cancellation notice for OS Friday class has been posted.", time: "2 days ago", unread: false }
];

function readStorage(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
        return fallback;
    }
}

function getProfile() {
    return { ...defaultProfile, ...readStorage(CAMPUS_PROFILE_KEY, {}) };
}

function getInitials(profile) {
    return `${profile.firstName?.[0] || "J"}${profile.lastName?.[0] || "D"}`.toUpperCase();
}

function setAvatar(element, profile) {
    if (!element) return;

    if (!profile.photo) {
        element.textContent = getInitials(profile);
        return;
    }

    const image = document.createElement("img");
    image.src = profile.photo;
    image.alt = "Profile photo";
    element.replaceChildren(image);
}

function hydrateProfile() {
    const profile = getProfile();
    const fullName = `Dr. ${profile.firstName} ${profile.lastName}`;

    const sidebarName = document.getElementById("sidebar-name");
    const sidebarDepartment = document.getElementById("sidebar-dept");

    if (sidebarName) sidebarName.textContent = fullName;
    if (sidebarDepartment) sidebarDepartment.textContent = profile.department;

    setAvatar(document.getElementById("sidebar-avatar"), profile);
    setAvatar(document.getElementById("topbar-avatar"), profile);
}

function getNotifications() {
    return readStorage(CAMPUS_NOTIFICATIONS_KEY, defaultNotifications);
}

function saveNotifications(notifications) {
    localStorage.setItem(CAMPUS_NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function syncNotificationBadges() {
    const unreadCount = getNotifications().filter((notification) => notification.unread).length;

    document.querySelectorAll(".notif-badge, .notif-count").forEach((badge) => {
        badge.textContent = unreadCount;
        badge.classList.toggle("is-hidden", unreadCount === 0);
    });
}

function applyPreferences() {
    const settings = readStorage(CAMPUS_SETTINGS_KEY, {});
    document.body.classList.toggle("dark", Boolean(settings.darkMode));
    document.querySelector(".sidebar")?.classList.toggle("compact", Boolean(settings.compactSidebar));
}

window.CampusPortal = {
    getProfile,
    hydrateProfile,
    getNotifications,
    saveNotifications,
    syncNotificationBadges,
    applyPreferences
};

document.addEventListener("DOMContentLoaded", () => {
    hydrateProfile();
    applyPreferences();
    syncNotificationBadges();
});
